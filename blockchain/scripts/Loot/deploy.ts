import "dotenv/config";
import { ethers } from "ethers";
import * as lootJson from "../../artifacts/contracts/Loot/Loot.sol/DungeonLoot.json";
import { connectToWallet } from "../utils";

/**
 * Deploys dungeon loot contract
 * > deploy
 */
async function main() {
  const { signer } = await connectToWallet();

  console.log("Deploying DungeonLoot contract");
  const TokenFactory = new ethers.ContractFactory(
    lootJson.abi,
    lootJson.bytecode,
    signer
  );
  const tokenContract = await TokenFactory.deploy();
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`DungeonLoot Contract deployed at ${tokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
