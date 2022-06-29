import { NFT_CONTRACT_ADDRESS, WALLET_PRIVATE_KEY } from "../Config/Config";
import { logError } from "../Config/Logger";
import { Staking } from "../Models/Staking";
import { connectToWallet } from "../Utils";
import compiledContract from '../Data/StakingToken';
import { Contract } from "ethers";

export function connectToStakingContract(funcName: string) {
    if (!WALLET_PRIVATE_KEY) {
        logError('Don\'t have wallet secret key setup', funcName);
        return;
    }
    if (!NFT_CONTRACT_ADDRESS) {
        logError('Don\'t have nft contract address setup', funcName);
        return;
    }

    const [provider, wallet, signer] = connectToWallet() ?? [];
    if (!provider) {
        logError('No provider', funcName);
        return;
    }

    const contract: Staking = new Contract(
        NFT_CONTRACT_ADDRESS,
        compiledContract.abi,
        signer
    ) as Staking;

    return { provider, wallet, signer, contract}
}

export async function allocateRewards(address: string) {
    const connectResult = connectToStakingContract("AllocateRewards");
    if (!connectResult) {
        return;
    }
    const {contract} = connectResult;

    const stake = await contract.stakes(address);
    if (!stake.isInitialized) {
        logError('Address is not staked.', "AllocateRewards");
        return;
    }

    const gemReward = Math.floor(100 + Math.random() * 100);
    const shouldRewardLoot = Math.random() < 0.33;
    const tx = await contract.allocateRewards(gemReward, address, shouldRewardLoot);
    await tx.wait();
}