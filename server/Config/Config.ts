import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const IS_DEV_ENV = NODE_ENV === 'development';
const SERVER_PORT = process.env.SERVER_PORT ?? 3001;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const AWS_REGION = process.env.AWS_REGION ?? 'us-east-1';

export {
    NODE_ENV,
    IS_DEV_ENV,
    SERVER_PORT,
    WALLET_PRIVATE_KEY,
    ALCHEMY_API_KEY,
    AWS_REGION
}