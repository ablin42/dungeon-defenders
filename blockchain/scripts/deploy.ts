import { ethers } from "hardhat";
import "dotenv/config";
import * as nftJson from "../artifacts/contracts/DungeonDefenders/DungeonDefenders.sol/DungeonDefenders.json";
import * as gemJson from "../artifacts/contracts/Gems.sol/Gems.json";
import * as stakingJson from "../artifacts/contracts/Staking.sol/Staking.json";
import * as lootJson from "../artifacts/contracts/Loot/Loot.sol/DungeonLoot.json";
import * as faucetJson from "../artifacts/contracts/Faucet.sol/GemsFaucet.json";
import { Gems } from "../typechain";

import { connectToWallet } from "./utils";
import { Contract } from "ethers";

async function main() {
  const { signer } = await connectToWallet();
  // const [signer] = await ethers.getSigners();

  // *Deploy Gems*
  console.log("Deploying GEMS contract");
  const TokenFactory = new ethers.ContractFactory(
    gemJson.abi,
    gemJson.bytecode,
    signer
  );
  let tokenContract!: Gems;
  const deployToken = async () => {
    tokenContract = (await TokenFactory.deploy()) as Gems;
    console.log("Awaiting confirmations");
    await tokenContract.deployed();
    console.log("Completed");
    console.log(`GEMS Contract deployed at ${tokenContract.address}`);
  };

  // *Deploy Faucet*
  console.log("Deploying FAUCET contract");
  const FaucetFactory = new ethers.ContractFactory(
    faucetJson.abi,
    faucetJson.bytecode,
    signer
  );
  let faucetContract!: Contract;
  const deployFaucet = async () => {
    faucetContract = await FaucetFactory.deploy(tokenContract.address);
    console.log("Awaiting confirmations");
    await faucetContract.deployed();
    console.log("Completed");
    console.log(`FAUCET Contract deployed at ${faucetContract.address}`);
  };

  // *Deploy LOOT*
  console.log("Deploying DungeonLoot contract");
  const LootFactory = new ethers.ContractFactory(
    lootJson.abi,
    lootJson.bytecode,
    signer
  );
  let lootContract!: Contract;
  const deployLoot = async () => {
    lootContract = await LootFactory.deploy();
    console.log("Awaiting confirmations");
    await lootContract.deployed();
    console.log("Completed");
    console.log(`DungeonLoot Contract deployed at ${lootContract.address}`);
  };

  await deployLoot();
  await deployToken();
  await deployFaucet();
  // await Promise.all([deployToken(), deployLoot(), deployFaucet()]);

  // *Deploy NFT*
  console.log("Deploying NFT contract");
  const nftFactory = new ethers.ContractFactory(
    nftJson.abi,
    nftJson.bytecode,
    signer
  );
  const nftContract = await nftFactory.deploy(lootContract.address);
  console.log("Awaiting confirmations");
  await nftContract.deployed();
  console.log("Completed");
  console.log(`NFT Contract deployed at ${nftContract.address}`);

  // *Deploy Staking*
  console.log("Deploying Staking contract");
  const stakingFactory = new ethers.ContractFactory(
    stakingJson.abi,
    stakingJson.bytecode,
    signer
  );
  const stakingContract = await stakingFactory.deploy(
    nftContract.address,
    lootContract.address,
    tokenContract.address
  );
  console.log("Awaiting confirmations");
  await stakingContract.deployed();
  console.log("Completed");
  console.log(`Staking Contract deployed at ${stakingContract.address}`);

  console.log(
    `export const GEMS_CONTRACT_ADDRESS = '${tokenContract.address}';`
  );
  console.log(
    `export const FAUCET_CONTRACT_ADDRESS = '${faucetContract.address}';`
  );
  console.log(
    `export const LOOT_CONTRACT_ADDRESS = '${lootContract.address}';`
  );
  console.log(`export const NFT_CONTRACT_ADDRESS = '${nftContract.address}';`);
  console.log(
    `export const STAKE_CONTRACT_ADDRESS = '${stakingContract.address}';`
  );

  console.log(`NFT_CONTRACT_ADDRESS=${nftContract.address}`);
  console.log(`LOOT_CONTRACT_ADDRESS=${lootContract.address}`);
  console.log(`STAKING_CONTRACT_ADDRESS=${stakingContract.address}`);

  tokenContract.transfer(
    stakingContract.address,
    ethers.utils.parseEther("2000000")
  );
  tokenContract.transfer(
    faucetContract.address,
    ethers.utils.parseEther("2000000")
  );
  tokenContract.transfer(
    "0x8a7Ff4D8573fe8549f8D4AFF392273eCE9f5f6bE",
    ethers.utils.parseEther("2000")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
