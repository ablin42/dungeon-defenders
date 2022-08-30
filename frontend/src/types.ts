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

export interface StakeState {
  owner: string;
  defenderId: string | 0;
  weaponId: 0;
  armorId: 0;
  bootsId: 0;
  gemsAmount: 0;
  props?: any;
}
