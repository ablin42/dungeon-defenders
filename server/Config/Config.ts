import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

export {
    SERVER_PORT,
    WALLET_PRIVATE_KEY,
    ALCHEMY_API_KEY,
    NFT_CONTRACT_ADDRESS
}