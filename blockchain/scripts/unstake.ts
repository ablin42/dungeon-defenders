import "dotenv/config";
import * as stakeJson from "../artifacts/contracts/Staking.sol/Staking.json";
import { Gems, Staking } from "../typechain";
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
  const stakeAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("defender index missing");
  const receiverAddress = process.argv[3];
  if (process.argv.length < 5) throw new Error("defender index missing");
  const amountStr = process.argv[4];
  const amount = parseInt(amountStr);

  const stake = new Contract(
    stakeAddress,
    stakeJson.abi,
    signer
  ) as Staking;
  
  console.log(`Transfering ${amount} gems to address=${receiverAddress}`);
  const tokenURI = await stake.unstake(receiverAddress);
  console.log(tokenURI)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
