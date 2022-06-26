import { ethers } from "hardhat";
import "dotenv/config";
import * as factoryJson from "../../artifacts/contracts/DungeonDefenders/DefenderFactory.sol/DefenderFactory.json";
import { connectToWallet } from "../utils";

/**
 * Deploys defender factory contract
 * > deploy
 */
async function main() {
  const { signer } = await connectToWallet();

  console.log("Deploying DefenderFactory contract");
  const TokenFactory = new ethers.ContractFactory(
    factoryJson.abi,
    factoryJson.bytecode,
    signer
  );
  const tokenContract = await TokenFactory.deploy();
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`DefenderFactory Contract deployed at ${tokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
