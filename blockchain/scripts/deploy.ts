import { ethers } from "hardhat";
import "dotenv/config";
import * as nftJson from "../artifacts/contracts/DungeonDefenders.sol/DungeonDefenders.json";
import * as gemJson from "../artifacts/contracts/Gems.sol/Gems.json";
import * as stakingJson from "../artifacts/contracts/StakingNFT.sol/StakingContract.json";
// import { connectToWallet } from "./utils";

async function main() {
  // const { signer } = await connectToWallet();
  const [signer] = await ethers.getSigners();

  // Deploy Gems
  console.log("Deploying GEMS contract");
  const TokenFactory = new ethers.ContractFactory(
    gemJson.abi,
    gemJson.bytecode,
    signer
  );
  const totalSupply = ethers.utils.parseEther("100000000");
  const tokenContract = await TokenFactory.deploy(signer.address, totalSupply);
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`GEMS Contract deployed at ${tokenContract.address}`);

  // Deploy NFT
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
  console.log(`NFT Contract deployed at ${nftContract.address}`);

  // Deploy Staking
  console.log("Deploying Staking contract");
  const stakingFactory = new ethers.ContractFactory(
    stakingJson.abi,
    stakingJson.bytecode,
    signer
  );
  const stakingContract = await stakingFactory.deploy(nftContract.address);
  console.log("Awaiting confirmations");
  await stakingContract.deployed();
  console.log("Completed");
  console.log(`Staking Contract deployed at ${stakingContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
