// Trait associated with an NFT
export interface NFTAttribute {
  trait_type: string;
  value: string;
}

// Alternative NFT Metadata
export interface NFT {
  name: string;
  description: string;
  tokenId: number;
  image: string;
  external_url: string;
  attributes: NFTAttribute[];
  owner?: string;
}
