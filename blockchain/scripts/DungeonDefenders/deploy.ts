import "dotenv/config";
import { ethers } from "ethers";
import { LOOT_CONTRACT_ADDRESS } from "../../index";
import * as defenderJson from "../../artifacts/contracts/DungeonDefenders/DungeonDefenders.sol/DungeonDefenders.json";
import { connectToWallet } from "../utils";

/**
 * Deploys dungeon defender contract
 * > deploy
 */
async function main() {
  const { signer } = await connectToWallet();

  console.log("Deploying DungeonDefenders contract");
  const TokenFactory = new ethers.ContractFactory(
    defenderJson.abi,
    defenderJson.bytecode,
    signer
  );
  const tokenContract = await TokenFactory.deploy(LOOT_CONTRACT_ADDRESS);
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`DungeonDefenders Contract deployed at ${tokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
