import "dotenv/config";
import * as gemsJson from "../artifacts/contracts/Gems.sol/Gems.json";
import { Gems } from "../typechain";
import { connectToWallet } from "./utils";
import { Contract, ethers } from "ethers";

/**
 * Retrieve a token uri by token id
 * > transferGems <GemsContract> <ReceiverAddress> <Amount>
 */
async function main() {
  const { signer } = await connectToWallet();

  // Get inputs
  if (process.argv.length < 3) throw new Error("DungeonDefender address missing");
  const gemsAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("defender index missing");
  const receiverAddress = process.argv[3];
  if (process.argv.length < 5) throw new Error("defender index missing");
  const amountStr = process.argv[4];
  const amount = parseInt(amountStr);

  const gems = new Contract(
    gemsAddress,
    gemsJson.abi,
    signer
  ) as Gems;
  
  console.log(`Transfering ${amount} gems to address=${receiverAddress}`);
  const tokenURI = await gems.transfer(receiverAddress, ethers.utils.parseEther(amountStr));
  console.log(tokenURI)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
