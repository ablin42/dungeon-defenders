
export interface DatabaseInterface { 
    // LOOT
    updateLootMintTime(tokenId: string, blockNumber: number): Promise<void>;
    getLootToMint(): Promise<Record<string, number>>;
    updateLootOwner(tokenId: string, owner: string): Promise<void>;
    getLootOwner(tokenId: string) : Promise<string | undefined>;
    getLootCollection(address: string) : Promise<string[] | undefined>;
    
    // NFT
    updateNFTMintTime(tokenId: string, blockNumber: number): Promise<void>;
    getNFTToMint(): Promise<Record<string, number>>;
    updateNFTOwner(tokenId: string, owner: string): Promise<void>;
    getNFTOwner(tokenId: string) : Promise<string | undefined>;
    getNFTCollection(address: string) : Promise<string[] | undefined>;
}