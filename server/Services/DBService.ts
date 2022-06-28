import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { NFT } from '../Models/NFT';
import { logError } from '../Config/Logger';

const db = new JsonDB(new Config('Data/db', true, false, '/'));

const NFT_TO_ADDRESS_TABLE = 'nftToAddress';
const ADDRESS_TO_COLLECTION_TABLE = 'addressToCollection';

export function updateNFTOwner(tokenId: string, owner: string) {
    const oldOwner = getNFTOwner(tokenId);
    if (oldOwner) {
        deleteNFTFromCollection(tokenId, owner);
    }

    db.push(`/${NFT_TO_ADDRESS_TABLE}/${tokenId}`, owner, true);
    db.push(`/${ADDRESS_TO_COLLECTION_TABLE}/${owner}`, tokenId, false);
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
        return db.getData(`/${ADDRESS_TO_COLLECTION_TABLE}/${address}`);
    } catch (e) {
        logError(JSON.stringify(e), 'getNFTCollection');
        return undefined;
    }
}

export function getNFTsTokenIds() : string[] {
    const data = db.getData(`/${NFT_TO_ADDRESS_TABLE}`);
    return Object.keys(data);
}