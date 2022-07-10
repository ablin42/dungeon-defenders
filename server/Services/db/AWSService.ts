import { config, DynamoDB } from "aws-sdk";
import { AWS_REGION } from "../../Config/Config";
import { logError } from "../../Config/Logger";
import { DatabaseInterface } from "./DatabaseInterface";

config.update({ region: AWS_REGION })
const db = new DynamoDB.DocumentClient();

const LOOT_TABLE_NAME = "dungeondefenders-loot";
const OWNER_ADDRESS_INDEX = "ownerAddress-blockNumber-index";
const TOKEN_ID_BLOCK_NUMBER_INDEX = "tokenId-blockNumber-index";
const DEFENDER_TABLE_NAME = "dungeondefenders-defenders";

// interface LootSchema {
//     tokenId: string,
//     ownerAddress: string,
//     blockNumber: number,
// }

// LOOT
async function updateLootMintTime(tokenId: string, blockNumber: number) {
    await db.put({
        TableName: LOOT_TABLE_NAME,
        Item: {
            tokenId,
            blockNumber
        }
    }).promise();
}
async function getLootToMint() {
    const results = await db.scan({
        TableName: LOOT_TABLE_NAME,
        IndexName: TOKEN_ID_BLOCK_NUMBER_INDEX,
        Limit: 20,
    }).promise();

    return (results.Items ?? []).reduce((map, item) => {
        map[item.tokenId] = item.blockNumber;
        return map;
    }, {}) as Record<string, number>;
}

async function updateLootOwner(tokenId: string, owner: string) {
    try {
        await db.update({
            TableName: LOOT_TABLE_NAME,
            Key: {
                "tokenId": tokenId
            },
            UpdateExpression: "SET ownerAddress=:owner",
            ExpressionAttributeValues: {
                ":owner": owner
            }
        }).promise();
    } catch (error) {
        logError("[updateLootOwner]", "AWSService");
        console.error(error)
    }
}

async function getLootOwner(tokenId: string): Promise<string | undefined> {
    const results = await db
        .query({
            TableName: LOOT_TABLE_NAME,
            KeyConditionExpression: "#tokenId = :tokenId",
            ExpressionAttributeNames: {
                "#tokenId": "tokenId"
            },
            ExpressionAttributeValues: {
                ":tokenId": tokenId
            }
        }).promise();

    if (!results.Items || results.Items.length === 0) {
        return undefined;
    }

    return results.Items[0].tokenId;
}

async function getLootCollection(address: string): Promise<string[] | undefined> {
    const results = await db
        .query({
            TableName: LOOT_TABLE_NAME,
            IndexName: OWNER_ADDRESS_INDEX,
            ScanIndexForward: false,
            KeyConditionExpression: "ownerAddress = :owner",
            ExpressionAttributeValues: {
                ":owner": address
            }
        }).promise();

    if (!results.Items || results.Items.length === 0) {
        return undefined;
    }

    return results.Items.map(x => x.tokenId);
}

// NFT
async function updateNFTMintTime(tokenId: string, blockNumber: number) {
    try {
        await db.put({
            TableName: DEFENDER_TABLE_NAME,
            Item: {
                tokenId,
                blockNumber
            }
        }).promise();
    } catch (error) {
        logError("[updateNFTMintTime]", "AWSService");
        console.error(error)
    }
}
async function getNFTToMint() {
    const results = await db.scan({
        TableName: DEFENDER_TABLE_NAME,
        IndexName: TOKEN_ID_BLOCK_NUMBER_INDEX,
        Limit: 20,
    }).promise();

    return (results.Items ?? []).reduce((map, item) => {
        map[item.tokenId] = item.blockNumber;
        return map;
    }, {}) as Record<string, number>;
}

async function updateNFTOwner(tokenId: string, owner: string) {
    try {
        await db.update({
            TableName: DEFENDER_TABLE_NAME,
            Key: {
                "tokenId": tokenId
            },
            UpdateExpression: "SET ownerAddress=:owner",
            ExpressionAttributeValues: {
                ":owner": owner
            }
        }).promise();
    } catch (error) {
        logError("[updateNFTOwner]", "AWSService");
        console.error(error)
    }
}

async function getNFTOwner(tokenId: string): Promise<string | undefined> {
    const results = await db
        .query({
            TableName: DEFENDER_TABLE_NAME,
            KeyConditionExpression: "#tokenId = :tokenId",
            ExpressionAttributeNames: {
                "#tokenId": "tokenId"
            },
            ExpressionAttributeValues: {
                ":tokenId": tokenId
            }
        }).promise();

    if (!results.Items || results.Items.length === 0) {
        return undefined;
    }

    return results.Items[0].tokenId;
}

async function getNFTCollection(address: string): Promise<string[] | undefined> {
    const results = await db
        .query({
            TableName: DEFENDER_TABLE_NAME,
            ScanIndexForward: false,
            IndexName: OWNER_ADDRESS_INDEX,
            KeyConditionExpression: "ownerAddress = :owner",
            ExpressionAttributeValues: {
                ":owner": address
            }
        }).promise();

    if (!results.Items || results.Items.length === 0) {
        return undefined;
    }

    return results.Items.map(x => x.tokenId);
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