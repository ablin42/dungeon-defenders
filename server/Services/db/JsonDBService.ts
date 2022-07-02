import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { logError } from '../../Config/Logger';
import {
    DatabaseInterface,
} from './DatabaseInterface';

const LOOT_TO_ADDRESS_TABLE = 'lootToAddress';
const LOOT_TO_MINT_TABLE = 'lootToMintBlockNumber';
const ADDRESS_TO_LOOT_TABLE = 'addressToLoot';
const NFT_TO_ADDRESS_TABLE = 'nftToAddress';
const NFT_TO_MINT_TABLE = 'nftToMintBlockNumber';
const ADDRESS_TO_COLLECTION_TABLE = 'addressToCollection';

const db = new JsonDB(new Config('Data/db', true, false, '/'));

// LOOT
async function updateLootMintTime(tokenId: string, blockNumber: number) {
    db.push(`/${LOOT_TO_MINT_TABLE}/${tokenId}`, blockNumber, true);
}
async function getLootToMint() {
    try {
        return db.getData(`/${LOOT_TO_MINT_TABLE}`) as Record<string, number>;
    } catch (e) {
        logError(JSON.stringify(e), 'getLootToMint');
        return {};
    }
}

async function updateLootOwner(tokenId: string, owner: string) {
    const oldOwner = await getLootOwner(tokenId);
    if (oldOwner) {
        deleteLootFromCollection(tokenId, owner);
    }

    db.push(`/${LOOT_TO_ADDRESS_TABLE}/${tokenId}`, owner, true);
    const collection = await getLootCollection(owner);
    const newCollection = [...(collection ?? []), tokenId];
    db.push(`/${ADDRESS_TO_LOOT_TABLE}/${owner}`, newCollection, true);
}
async function deleteLootFromCollection(tokenId: string, address: string) {
    try {
        const tokens: string[] = db.getData(`/${ADDRESS_TO_LOOT_TABLE}/${address}`);
        const filteredTokens = tokens.filter(t => t !== tokenId);
        db.push(`/${ADDRESS_TO_LOOT_TABLE}/${address}`, filteredTokens, true);
    } catch (e) {
        logError(JSON.stringify(e), 'deleteLootFromCollection');
        return undefined;
    }
}

async function getLootOwner(tokenId: string) : Promise<string | undefined> {
    try {
        return db.getData(`/${LOOT_TO_ADDRESS_TABLE}/${tokenId}`);
    } catch (e) {
        logError(JSON.stringify(e), 'getLootOwner');
        return undefined;
    }
}

async function getLootCollection(address: string) : Promise<string[] | undefined> {
    try {
        return db.getData(`/${ADDRESS_TO_LOOT_TABLE}/${address}`) as string[];
    } catch (e) {
        logError(JSON.stringify(e), 'getLootCollection');
        return undefined;
    }
}

// NFT
async function updateNFTMintTime(tokenId: string, blockNumber: number) {
    db.push(`/${NFT_TO_MINT_TABLE}/${tokenId}`, blockNumber, true);
}
async function getNFTToMint() {
    try {
        return db.getData(`/${NFT_TO_MINT_TABLE}`) as Record<string, number>;
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTToMint');
        return {};
    }
}

async function updateNFTOwner(tokenId: string, owner: string) {
    const oldOwner = await getNFTOwner(tokenId);
    if (oldOwner) {
        deleteNFTFromCollection(tokenId, owner);
    }

    db.push(`/${NFT_TO_ADDRESS_TABLE}/${tokenId}`, owner, true);
    const collection = await getNFTCollection(owner);
    const newCollection = [...(collection ?? []), tokenId];
    db.push(`/${ADDRESS_TO_COLLECTION_TABLE}/${owner}`, newCollection, true);
}
async function deleteNFTFromCollection(tokenId: string, address: string) {
    try {
        const tokens: string[] = db.getData(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`);
        const filteredTokens = tokens.filter(t => t !== tokenId);
        db.push(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`, filteredTokens, true);
    } catch (e) {
        logError(JSON.stringify(e), 'deleteNFTFromCollection');
        return undefined;
    }
}

async function getNFTOwner(tokenId: string) : Promise<string | undefined> {
    try {
        return db.getData(`/${NFT_TO_ADDRESS_TABLE}/${tokenId}`);
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTOwner');
        return undefined;
    }
}

async function getNFTCollection(address: string) : Promise<string[] | undefined> {
    try {
        return db.getData(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`) as string[];
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTCollection');
        return undefined;
    }
}

const databaseConection: DatabaseInterface = {
    // Loot
    updateLootMintTime,
    getLootToMint,
    updateLootOwner,
    getLootOwner,
    getLootCollection,
    
    // NFT
    updateNFTMintTime,
    getNFTToMint,
    updateNFTOwner,
    getNFTOwner,
    getNFTCollection
}

export default databaseConection;