// A generic interface
export interface GenericInterface {
  generic: string;
}

// Trait associated with an NFT
export interface NFTAttribute {
  trait_type: string;
  value: string;
}

// NFT Metadata
// Deprecated, keeping this here just in case
export interface NFT {
  name: string;
  description: string;
  tokenId: number;
  image: string;
  external_url: string;
  attributes: NFTAttribute[];
}

// Alternative NFT Metadata
export interface NFTALT {
  name: string;
  description: string;
  tokenId: number;
  image: string;
  external_url: string;
  attributes: NFTAttribute[];
}

// A component used to generate an NFT
export interface NFTComponent {
  imgPath: string;
  attribute: NFTAttribute;
}

// A generated NFT
export interface GeneratedNFT {
  data: Buffer;
  attributes: NFTAttribute[];
}
