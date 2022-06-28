// Trait associated with an NFT
export interface NFTAttribute {
    trait_type: string,
    value: string
}

// NFT Metadata
export interface NFT {
    name: string,
    description: string,
    tokenId: number,
    image: string,
    external_url: string,
    attributes: NFTAttribute[]
}

// A component used to generate an NFT 
export interface NFTComponent {
    imgPath: string,
    attribute: NFTAttribute
}

// A generated NFT
export interface GeneratedNFT {
    data: Buffer,
    attributes: NFTAttribute[]
}