import { NFT } from "../Models/NFT";
import { connectToWallet } from "../Utils";
import { Interface } from "ethers/lib/utils";
import { Canvas, createCanvas, loadImage } from "canvas";
import { logError, logInfo, logWarn } from "../Config/Logger";
import {
    BACKGROUND_COMPONENTS,
    CHARACTER_COMPONENTS,
    WEAPON_COMPONENTS,
} from "../Data/NFTComponents";
import { Contract, ethers } from "ethers";
import { WALLET_PRIVATE_KEY } from "../Config/Config";
import db from "./db/DBService";
import {
    DEFENDER_ABI,
    DEFENDER_CONTRACT_ADDRESS,
    DungeonDefendersContract,
    DungeonLootContract,
} from "dungeon-defenders-contracts";
import { connectToDungeonLootContract } from "./LootService";

export async function getNFT(
    tokenId: string,
    exisitingContract?: DungeonDefendersContract | DungeonLootContract
): Promise<NFT | undefined> {
    try {
        let contract = exisitingContract;
        if (!contract) {
            const connectResult = connectToDungeonDefenderContract("getNFT");
            if (!connectResult) {
                return undefined;
            }

            const { contract: c } = connectResult;
            contract = c;
        }

        const tokenURIBase64 = await contract.tokenURI(tokenId);
        const jsonBase64 = tokenURIBase64.split(",")[1];
        const jsonStr = Buffer.from(jsonBase64, "base64").toString("utf-8");
        return JSON.parse(jsonStr) as NFT;
    } catch (error) {
        logError(error as any, "getNFT");
    }
}

export async function getNFTCollection(address: string): Promise<NFT[]> {
    const tokenIds = await db.getNFTCollection(address);
    if (!tokenIds || tokenIds.length === 0) {
        logWarn(`No NFTs for address=${address}`, "getNFTCollection");
        return [];
    }

    const connectResult = connectToDungeonDefenderContract("getNFTCollection");
    if (!connectResult) {
        return [];
    }
    const { contract } = connectResult;

    const ops: Promise<NFT | undefined>[] = tokenIds.map((t) =>
        getNFT(t, contract)
    );
    const responses = await Promise.all(ops);
    const NFTs = responses.filter((r) => !!r) as NFT[];

    return NFTs;
}

export async function getLatestNFTs(numOfNFTs: number): Promise<NFT[]> {
    const nftToMint = await db.getNFTToMint();

    const tokenIds = Object.keys(nftToMint)
        .sort((a, b) => nftToMint[b] - nftToMint[a])
        .splice(0, numOfNFTs);

    const connectResult = connectToDungeonDefenderContract("getLatestNFTs");
    if (!connectResult) {
        return [];
    }
    const { contract } = connectResult;

    const ops: Promise<NFT | undefined>[] = tokenIds.map((t) =>
        getNFT(t, contract)
    );
    const responses = await Promise.all(ops);

    const users: Promise<string | undefined>[] = tokenIds.map((t) =>
        db.getNFTOwner(t)
    );
    const owners = await Promise.all(users);
    const result = responses.map((item, index) => {
        return {
            ...item,
            owner: owners[index],
        };
    });
    const NFTs = result.filter((r) => !!r) as NFT[];

    return NFTs;
}

/**
 * Renders an NFT
 * @param tokenId The NFT to render
 * @returns Data URI for Rendered NFT
 */
export async function renderNFT(tokenId: number): Promise<Buffer> {
    let connectResult = connectToDungeonDefenderContract('renderNFT');
    if (!connectResult) {
        throw "Failed to connect to DDS contract";
    }
    const { contract: ddsContract } = connectResult;
    const defender = await ddsContract.defenders(tokenId);
    const aesthetics = await ddsContract.aesthetics(tokenId);

    const background = BACKGROUND_COMPONENTS[aesthetics.background];
    const character = CHARACTER_COMPONENTS[defender.characterType];
    const weapon = WEAPON_COMPONENTS[aesthetics.weapon];

    const canvas: Canvas = createCanvas(480, 480);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const backgroundImg = await loadImage(background.imgPath);
    ctx.drawImage(backgroundImg, 0, 0, 480, 480);
    const floorImg = await loadImage(`Assets/Floor/${1}.png`);
    ctx.drawImage(floorImg, 0, 160, 160, 160);
    ctx.drawImage(floorImg, 160, 160, 160, 160);
    ctx.drawImage(floorImg, 320, 160, 160, 160);
    ctx.drawImage(floorImg, 0, 320, 160, 160);
    ctx.drawImage(floorImg, 160, 320, 160, 160);
    ctx.drawImage(floorImg, 320, 320, 160, 160);
    const characterImg = await loadImage(character.imgPath);
    const characterWidth = 16;
    const characterHeight = 28;
    ctx.drawImage(characterImg, 0, 0, characterWidth, characterHeight, 320 - characterWidth * 5, 230 - characterHeight * 5, characterWidth * 10, characterHeight * 10);
    const weaponImg = await loadImage(weapon.imgPath);
    const rot = 2.79253;
    ctx.save();
    ctx.translate(280, 330);
    ctx.rotate(rot);
    ctx.translate(-40, -40);
    ctx.drawImage(weaponImg, 0, 0, weaponImg.width * 10, weaponImg.height * 10);
    ctx.restore();

    return canvas.toBuffer();
}

export function connectToDungeonDefenderContract(funcName: string) {
    if (!WALLET_PRIVATE_KEY) {
        logError("Don't have wallet secret key setup", funcName);
        return;
    }
    if (!DEFENDER_CONTRACT_ADDRESS) {
        logError("Don't have nft contract address setup", funcName);
        return;
    }

    const [provider, wallet, signer] = connectToWallet() ?? [];
    if (!provider) {
        logError("No provider", funcName);
        return;
    }

    const contract: DungeonDefendersContract = new Contract(
        DEFENDER_CONTRACT_ADDRESS,
        DEFENDER_ABI,
        signer
    ) as DungeonDefendersContract;

    return { provider, wallet, signer, contract };
}

async function handleTransferEvent(
    tokenId: number,
    newOwner: string,
    blockNumber?: number
) {
    const tokenIdStr = tokenId.toString();
    if (blockNumber) {
        await db.updateNFTMintTime(tokenIdStr, blockNumber);
    }
    await db.updateNFTOwner(tokenIdStr, newOwner);
}
export function registerEventListeners() {
    const connectResult = connectToDungeonDefenderContract(
        "registerEventListeners"
    );
    if (!connectResult) {
        return;
    }

    const { provider, contract: tokenContract } = connectResult;
    const iface = new Interface(DEFENDER_ABI);

    logInfo("Connecting to transfer events", "registerEventListeners");
    const transferFilter = tokenContract.filters.Transfer();
    provider.on(transferFilter, async (log) => {
        const parsedLog = iface.parseLog(log);

        const fromStr = parsedLog.args.from;
        const toStr = parsedLog.args.to;
        const tokenId = parsedLog.args.tokenId.toString();
        logInfo(
            `Transfered tokenId=${tokenId} from=${fromStr} to=${toStr}`,
            "registerEventListeners"
        );

        await handleTransferEvent(
            tokenId,
            toStr,
            ethers.constants.AddressZero === fromStr ? log.blockNumber : undefined
        );
    });
}
