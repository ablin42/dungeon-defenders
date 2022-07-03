import { WALLET_PRIVATE_KEY } from "../Config/Config";
import { logError } from "../Config/Logger";
import { connectToWallet } from "../Utils";
import { Contract, ethers } from "ethers";
import { STAKE_ABI, STAKE_CONTRACT_ADDRESS, StakingContract } from "dungeon-defenders-contracts";

export function connectToStakingContract(funcName: string) {
    if (!WALLET_PRIVATE_KEY) {
        logError('Don\'t have wallet secret key setup', funcName);
        return;
    }
    if (!STAKE_CONTRACT_ADDRESS) {
        logError('Don\'t have stake contract address setup', funcName);
        return;
    }

    const [provider, wallet, signer] = connectToWallet() ?? [];
    if (!provider) {
        logError('No provider', funcName);
        return;
    }

    const contract: StakingContract = new Contract(
        STAKE_CONTRACT_ADDRESS,
        STAKE_ABI,
        signer
    ) as StakingContract;

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
    const gemRewardBN = ethers.utils.parseEther(gemReward.toString());;
    const expReward = Math.floor(35 + Math.random() * 65);
    const shouldRewardLoot = Math.random() < 0.33;
    const tx = await contract.allocateRewards(gemRewardBN, expReward, address, shouldRewardLoot);
    await tx.wait();
}