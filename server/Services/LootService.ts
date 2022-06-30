import { LOOT_CONTRACT_ADDRESS, WALLET_PRIVATE_KEY } from '../Config/Config';
import { logError, logInfo, logWarn } from '../Config/Logger';
import { DungeonLoot } from '../Models/Loot';
import { connectToWallet } from '../Utils';
import * as db from './DBService';
import compiledContract from "../Data/LootToken";
import { getNFT } from './NFTService';
import { NFT } from '../Models/NFT';
import { Contract, ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';

export function connectToDungeonLootContract(funcName: string) {
    if (!WALLET_PRIVATE_KEY) {
        logError('Don\'t have wallet secret key setup', funcName);
        return;
    }
    if (!LOOT_CONTRACT_ADDRESS) {
        logError('Don\'t have loot contract address setup', funcName);
        return;
    }

    const [provider, wallet, signer] = connectToWallet() ?? [];
    if (!provider) {
        logError('No provider', funcName);
        return;
    }

    const contract: DungeonLoot = new Contract(
        LOOT_CONTRACT_ADDRESS,
        compiledContract.abi,
        signer
    ) as DungeonLoot;

    return { provider, wallet, signer, contract}
}

export async function getLootCollection(address: string) : Promise<NFT[]> {
    const tokenIds = db.getLootCollection(address);
    if (!tokenIds || tokenIds.length === 0) {
        logWarn(`No loots for address=${address}`, 'getLootCollection')
        return [];
    }

    const connectResult = connectToDungeonLootContract('getLootCollection');
    if (!connectResult) {
        return [];
    }
    const {contract} = connectResult;

    const ops : Promise<NFT | undefined>[] = tokenIds.map(t => getNFT(t, contract));
    const responses = await Promise.all(ops);
    const NFTs = responses.filter(r => !!r) as NFT[];

    return NFTs;
}

export async function getLatestLoots(numOfNFTs: number) : Promise<NFT[]> {
    const nftToMint = db.getLootToMint();

    const tokenIds = Object.keys(nftToMint)
            .sort((a, b) => nftToMint[a] - nftToMint[b])
            .splice(0, numOfNFTs);
            
    const connectResult = connectToDungeonLootContract('getLatestLoots');
    if (!connectResult) {
        return [];
    }
    const {contract} = connectResult;

    const ops : Promise<NFT | undefined>[] = tokenIds.map(t => getNFT(t, contract));
    const responses = await Promise.all(ops);
    const NFTs = responses.filter(r => !!r) as NFT[];

    return NFTs;
}

async function handleTransferEvent(tokenId: number, newOwner: string, blockNumber?: number) {
    const tokenIdStr = tokenId.toString();
    if (blockNumber) {
        db.updateLootMintTime(tokenIdStr, blockNumber);
    }
    db.updateLootOwner(tokenIdStr, newOwner);
}
export function registerEventListeners() {
    const connectResult = connectToDungeonLootContract('loot | registerEventListeners');
    if (!connectResult) {
        return;
    }

    const {provider, contract: tokenContract} = connectResult;
    const iface = new Interface(compiledContract.abi);

    logInfo('Connecting to transfer events', 'loot | registerEventListeners');
    const transferFilter = tokenContract.filters.Transfer();
    provider.on(transferFilter, async (log) => {
        const parsedLog = iface.parseLog(log);
        
        const fromStr = parsedLog.args.from;
        const toStr = parsedLog.args.to;
        const tokenId = parsedLog.args.tokenId.toString();
        logInfo(
          `Transfered tokenId=${tokenId} from=${fromStr} to=${toStr}`,
          "loot | registerEventListeners"
        );
    
        await handleTransferEvent(tokenId, toStr, ethers.constants.AddressZero === fromStr ? log.blockNumber : undefined);
    });
}
