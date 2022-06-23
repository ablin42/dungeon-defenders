import { ethers } from "hardhat";
import "dotenv/config";
import * as nftJson from "../artifacts/contracts/DungeonDefenders.sol/DungeonDefenders.json";
import * as gemJson from "../artifacts/contracts/Gems.sol/Gems.json";
// import { connectToWallet } from "./utils";

async function main() {
  // const { signer } = await connectToWallet();
  const [signer] = await ethers.getSigners();

  console.log("Deploying GEMS contract");
  const TokenFactory = new ethers.ContractFactory(
    gemJson.abi,
    gemJson.bytecode,
    signer
  );
  const tokenContract = await TokenFactory.deploy();
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`GEMS Contract deployed at ${tokenContract.address}`);

  // Deploy wallet
  console.log("Deploying NFT contract");
  const nftFactory = new ethers.ContractFactory(
    nftJson.abi,
    nftJson.bytecode,
    signer
  );
  const nftContract = await nftFactory.deploy();
  console.log("Awaiting confirmations");
  await nftContract.deployed();
  console.log("Completed");
  console.log(`NFT Contract deployed at ${tokenContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
