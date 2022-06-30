import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { NFT } from '../Models/NFT';
import { logError } from '../Config/Logger';

const db = new JsonDB(new Config('Data/db', true, false, '/'));

const LOOT_TO_ADDRESS_TABLE = 'lootToAddress';
const LOOT_TO_MINT_TABLE = 'lootToMintBlockNumber';
const ADDRESS_TO_LOOT_TABLE = 'addressToLoot';
const NFT_TO_ADDRESS_TABLE = 'nftToAddress';
const NFT_TO_MINT_TABLE = 'nftToMintBlockNumber';
const ADDRESS_TO_COLLECTION_TABLE = 'addressToCollection';

// LOOT
export function updateLootMintTime(tokenId: string, blockNumber: number) {
    db.push(`/${LOOT_TO_MINT_TABLE}/${tokenId}`, blockNumber, true);
}
export function getLootToMint() {
    try {
        return db.getData(`/${LOOT_TO_MINT_TABLE}`) as Record<string, number>;
    } catch (e) {
        logError(JSON.stringify(e), 'getLootToMint');
        return {};
    }
}

export function updateLootOwner(tokenId: string, owner: string) {
    const oldOwner = getLootOwner(tokenId);
    if (oldOwner) {
        deleteLootFromCollection(tokenId, owner);
    }

    db.push(`/${LOOT_TO_ADDRESS_TABLE}/${tokenId}`, owner, true);
    const collection = getLootCollection(owner);
    const newCollection = [...(collection ?? []), tokenId];
    db.push(`/${ADDRESS_TO_LOOT_TABLE}/${owner}`, newCollection, true);
}
export function deleteLootFromCollection(tokenId: string, address: string) {
    try {
        const tokens: string[] = db.getData(`/${ADDRESS_TO_LOOT_TABLE}/${address}`);
        const filteredTokens = tokens.filter(t => t !== tokenId);
        db.push(`/${ADDRESS_TO_LOOT_TABLE}/${address}`, filteredTokens, true);
    } catch (e) {
        logError(JSON.stringify(e), 'deleteLootFromCollection');
        return undefined;
    }
}

export function getLootOwner(tokenId: string) : string | undefined {
    try {
        return db.getData(`/${LOOT_TO_ADDRESS_TABLE}/${tokenId}`);
    } catch (e) {
        logError(JSON.stringify(e), 'getLootOwner');
        return undefined;
    }
}

export function getLootCollection(address: string) : string[] | undefined {
    try {
        return db.getData(`/${ADDRESS_TO_LOOT_TABLE}/${address}`) as string[];
    } catch (e) {
        logError(JSON.stringify(e), 'getLootCollection');
        return undefined;
    }
}

// NFT
export function updateNFTMintTime(tokenId: string, blockNumber: number) {
    db.push(`/${NFT_TO_MINT_TABLE}/${tokenId}`, blockNumber, true);
}
export function getNFTToMint() {
    try {
        return db.getData(`/${NFT_TO_MINT_TABLE}`) as Record<string, number>;
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTToMint');
        return {};
    }
}

export function updateNFTOwner(tokenId: string, owner: string) {
    const oldOwner = getNFTOwner(tokenId);
    if (oldOwner) {
        deleteNFTFromCollection(tokenId, owner);
    }

    db.push(`/${NFT_TO_ADDRESS_TABLE}/${tokenId}`, owner, true);
    const collection = getNFTCollection(owner);
    const newCollection = [...(collection ?? []), tokenId];
    db.push(`/${ADDRESS_TO_COLLECTION_TABLE}/${owner}`, newCollection, true);
}
export function deleteNFTFromCollection(tokenId: string, address: string) {
    try {
        const tokens: string[] = db.getData(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`);
        const filteredTokens = tokens.filter(t => t !== tokenId);
        db.push(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`, filteredTokens, true);
    } catch (e) {
        logError(JSON.stringify(e), 'deleteNFTFromCollection');
        return undefined;
    }
}

export function getNFTOwner(tokenId: string) : string | undefined {
    try {
        return db.getData(`/${NFT_TO_ADDRESS_TABLE}/${tokenId}`);
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTOwner');
        return undefined;
    }
}

export function getNFTCollection(address: string) : string[] | undefined {
    try {
        return db.getData(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`) as string[];
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTCollection');
        return undefined;
    }
}

export function getNFTsTokenIds() : string[] {
    const data = db.getData(`/${NFT_TO_ADDRESS_TABLE}`);
    return Object.keys(data);
}