import { NFT } from "../Models/NFT";
import { connectToWallet, getRandomNumber } from "../Utils";
import mergeImages from 'merge-images';
import { Canvas, Image } from 'canvas';
import { logError, logInfo, logWarn } from "../Config/Logger";
import { BACKGROUND_COMPONENTS, PLAYER_COMPONENTS, WEAPON_COMPONENTS } from "../Data/NFTComponents";
import { Contract } from 'ethers';
import { NFT_CONTRACT_ADDRESS, WALLET_PRIVATE_KEY } from "../Config/Config";
import { DungeonDefenders, } from "../Models/NFTToken";
import * as db from './DBService';
import compiledContract from "../Data/NFTToken";

export function getNFTOwner(tokenId: string) : string | undefined {
    return db.getNFTOwner(tokenId);
}

export async function getNFT(tokenId: string, exisitingContract?: DungeonDefenders) : Promise<NFT | undefined> {
    let contract = exisitingContract;
    if (!contract) {
        const connectResult = connectToDungeonDefenderContract('registerEventListeners');
        if (!connectResult) {
            return undefined;
        }
    
        const {contract: c} = connectResult;
        contract = c;
    }

    const tokenURIBase64 = await contract.tokenURI(tokenId);
    const jsonBase64 = tokenURIBase64.split(',')[1];
    const jsonStr = Buffer.from(jsonBase64, 'base64').toString('ascii');
    return JSON.parse(jsonStr) as NFT;
}

export async function getNFTCollection(address: string) : Promise<NFT[]> {
    const tokenIds = db.getNFTCollection(address);
    if (!tokenIds || tokenIds.length === 0) {
        logWarn(`No NFTs for address=${address}`, 'getNFTCollection')
        return [];
    }

    const connectResult = connectToDungeonDefenderContract('registerEventListeners');
    if (!connectResult) {
        return [];
    }

    const {contract} = connectResult;

    const ops : Promise<NFT | undefined>[] = tokenIds.map(t => getNFT(t, contract));
    const responses = await Promise.all(ops);
    const NFTs = responses.filter(r => !!r) as NFT[];

    return NFTs;
}

/**
 * Renders an NFT
 * @param tokenId The NFT to render
 * @returns Data URI for Rendered NFT
 */
export async function renderNFT(tokenId: string) : Promise<Buffer> {
    // TODO make accurate
    const background = BACKGROUND_COMPONENTS[getRandomNumber(0, 4)];
    const player = PLAYER_COMPONENTS[getRandomNumber(0, 6)];
    const weapon = WEAPON_COMPONENTS[getRandomNumber(0, 4)];

    logInfo(`background=${JSON.stringify(background)}`, 'generateNFT');
    logInfo(`player=${JSON.stringify(player)}`, 'generateNFT');
    logInfo(`weapon=${JSON.stringify(weapon)}`, 'generateNFT');

    const mergedImage = await mergeImages([
        background.imgPath,
        {
            src: `Assets/Floor/${getRandomNumber(1, 9)}.png`,
            x: 0,
            y: 160
        },
        {
            src: `Assets/Floor/${getRandomNumber(1, 9)}.png`,
            x: 160,
            y: 160
        },
        {
            src: `Assets/Floor/${getRandomNumber(1, 9)}.png`,
            x: 320,
            y: 160
        },
        {
            src: `Assets/Floor/${getRandomNumber(1, 9)}.png`,
            x: 0,
            y: 320
        },
        {
            src: `Assets/Floor/${getRandomNumber(1, 9)}.png`,
            x: 160,
            y: 320
        },
        {
            src: `Assets/Floor/${getRandomNumber(1, 9)}.png`,
            x: 320,
            y: 320
        },
        player.imgPath,
        weapon.imgPath], {
        Canvas,
        Image
    });
    const mergedImageBuffer = Buffer.from(mergedImage.substring(mergedImage.indexOf(',')));

    return mergedImageBuffer;
}

export function connectToDungeonDefenderContract(funcName: string) {
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

    const contract: DungeonDefenders = new Contract(
        NFT_CONTRACT_ADDRESS,
        compiledContract.abi,
        signer
    ) as DungeonDefenders;

    return { provider, wallet, signer, contract}
}

async function handleTransferEvent(tokenId: number, newOwner: string) {
    const tokenIdStr = tokenId.toString();
    db.updateNFTOwner(tokenIdStr, newOwner);
}
export function registerEventListeners() {
    const connectResult = connectToDungeonDefenderContract('registerEventListeners');
    if (!connectResult) {
        return;
    }

    const {provider, contract: tokenContract} = connectResult;

    logInfo('Connecting to transfer events', 'registerEventListeners');
    const transferFilter = tokenContract.filters.Transfer();
    provider.on(transferFilter, async (log) => {
        const fromStr = log.topics[1];
        const toStr = log.topics[2];
        const tokenIdStr = log.topics[3];
        logInfo(`Transfered tokenId=${tokenIdStr} from=${fromStr} to=${toStr}`, 'registerEventListeners');
        const tokenId = parseInt(tokenIdStr.replace('0x', ''), 16); // converts the log's tokenId from base 16 to base 10
        await handleTransferEvent(tokenId, toStr);
    });
}