import { WALLET_PRIVATE_KEY } from '../Config/Config';
import { logError, logInfo, logWarn } from '../Config/Logger';
import { connectToWallet } from '../Utils';
import db from './db/DBService';
import { getNFT } from './NFTService';
import { NFT } from '../Models/NFT';
import { Contract, ethers } from 'ethers';
import { Interface } from 'ethers/lib/utils';
import { DungeonLootContract, LOOT_ABI, LOOT_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';
import { Canvas, createCanvas, loadImage } from 'canvas';
import { BACKGROUND_COMPONENTS, WEAPON_COMPONENTS } from '../Data/NFTComponents';

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

    const contract: DungeonLootContract = new Contract(
        LOOT_CONTRACT_ADDRESS,
        LOOT_ABI,
        signer
    ) as DungeonLootContract;

    return { provider, wallet, signer, contract }
}

export async function getLootCollection(address: string): Promise<NFT[]> {
    const tokenIds = await db.getLootCollection(address);
    if (!tokenIds || tokenIds.length === 0) {
        logWarn(`No loots for address=${address}`, 'getLootCollection')
        return [];
    }

    const connectResult = connectToDungeonLootContract('getLootCollection');
    if (!connectResult) {
        return [];
    }
    const { contract } = connectResult;

    const ops: Promise<NFT | undefined>[] = tokenIds.map(t => getNFT(t, contract));
    const responses = await Promise.all(ops);
    const NFTs = responses.filter(r => !!r) as NFT[];

    return NFTs;
}

export async function getLatestLoots(numOfNFTs: number): Promise<NFT[]> {
    const nftToMint = await db.getLootToMint();

    const tokenIds = Object.keys(nftToMint)
        .sort((a, b) => nftToMint[a] - nftToMint[b])
        .splice(0, numOfNFTs);

    const connectResult = connectToDungeonLootContract('getLatestLoots');
    if (!connectResult) {
        return [];
    }
    const { contract } = connectResult;

    const ops: Promise<NFT | undefined>[] = tokenIds.map(t => getNFT(t, contract));
    const responses = await Promise.all(ops);
    const NFTs = responses.filter(r => !!r) as NFT[];

    return NFTs;
}

enum LootType {
    Weapon,
    Background
}
export async function renderLoot(tokenId: number): Promise<Buffer> {
    let connectResult = connectToDungeonLootContract('renderLoot');
    if (!connectResult) {
        throw "Failed to connect to DLOOT contract";
    }
    const { contract: lootContract } = connectResult;
    const loot = await lootContract.loot(tokenId);

    const type = loot.background ? LootType.Background : LootType.Weapon;

    const canvas: Canvas = createCanvas(480, 480);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#181a1b';
    ctx.fillRect(0, 0, 480, 480);
    switch (type) {
        case LootType.Weapon:
            const weapon = WEAPON_COMPONENTS[loot.weapon];
            const weaponImg = await loadImage(weapon.imgPath);
            const rot = 5.49779;
            ctx.save();
            ctx.translate(240, 240);
            ctx.rotate(rot);
            ctx.translate(weaponImg.width * -6, weaponImg.height * -6);
            ctx.drawImage(weaponImg, 0, 0, weaponImg.width * 12, weaponImg.height * 12);
            ctx.restore();
            break;
        case LootType.Background:
            const background = BACKGROUND_COMPONENTS[loot.background];
            const backgroundImg = await loadImage(background.imgPath);
            ctx.drawImage(backgroundImg, 0, 0, 480, 480);
            break;
    }

    return canvas.toBuffer();
}

async function handleTransferEvent(tokenId: number, newOwner: string, blockNumber?: number) {
    const tokenIdStr = tokenId.toString();
    if (blockNumber) {
        await db.updateLootMintTime(tokenIdStr, blockNumber);
    }
    await db.updateLootOwner(tokenIdStr, newOwner);
}
export function registerEventListeners() {
    const connectResult = connectToDungeonLootContract('loot | registerEventListeners');
    if (!connectResult) {
        return;
    }

    const { provider, contract: tokenContract } = connectResult;
    const iface = new Interface(LOOT_ABI);

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
