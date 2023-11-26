import "dotenv/config";
import { ethers } from "ethers";

interface connectToWalletOutput {
  wallet: ethers.Wallet;
  signer: ethers.Signer;
}

/**
 * Connect to the environment's wallet.
 * @returns {connectToWalletOutput} The wallet and signer.
 */
export async function connectToWallet(
  network: ethers.providers.Networkish = "goerli"
): Promise<connectToWalletOutput> {
  // Connect to environment's wallet
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : process.env.PRIVATE_KEY
      ? new ethers.Wallet(process.env.PRIVATE_KEY)
      : null;

  // Validate wallet exists
  if (!wallet) {
    throw new Error("No wallet configured in environment");
  }

  // Get signer
  console.log(`Using address ${wallet.address}`);
  console.log(`Using network ${network}`);
  const provider = new ethers.providers.AlchemyProvider(
    network,
    process.env.ALCHEMY_API_KEY
  );
  const signer = wallet.connect(provider);

  // Check signer's balance
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough goerli ether (0.1)");
  }

  return {
    wallet,
    signer,
  };
}
