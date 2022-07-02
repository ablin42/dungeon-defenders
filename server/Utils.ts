import { ethers } from "ethers";
import { ALCHEMY_API_KEY, WALLET_PRIVATE_KEY } from "./Config/Config";
import { logError } from "./Config/Logger";

export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function connectToWallet() : [ethers.providers.BaseProvider, ethers.Wallet, ethers.Signer]  | undefined {
    if (!WALLET_PRIVATE_KEY) {
        logError('Don\'t have wallet secret key setup', 'connectToWallet');
        return;
    }

    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);    
    
    const provider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
    const signer = wallet.connect(provider);

    return [provider, wallet, signer]
}