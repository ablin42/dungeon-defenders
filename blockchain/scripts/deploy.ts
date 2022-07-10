import { ethers } from "hardhat";
import "dotenv/config";

import {
  DEFENDER_ABI,
  DEFENDER_BYTECODE,
  FAUCET_ABI,
  FAUCET_BYTECODE,
  GEMS_ABI,
  GEMS_BYTECODE,
  LOOT_ABI,
  LOOT_BYTECODE,
  STAKE_ABI,
  STAKE_BYTECODE,
} from "../index";

import { Contract, Signer } from "ethers";

import { promises as fs } from "fs";
import { Gems } from "../typechain";

import { setup } from './setup';

async function deploy(signer: Signer) {
  // *Deploy Gems*
  const TokenFactory = new ethers.ContractFactory(
    GEMS_ABI,
    GEMS_BYTECODE,
    signer
  );
  let gemsContract!: Gems;
  const deployToken = async () => {
    console.log("Deploying GEMS contract");
    gemsContract = (await TokenFactory.deploy()) as Gems;
    console.log("Awaiting confirmations");
    await gemsContract.deployed();
    console.log("Completed");
    console.log(`GEMS Contract deployed at ${gemsContract.address}`);
  };

  // *Deploy LOOT*
  const LootFactory = new ethers.ContractFactory(
    LOOT_ABI,
    LOOT_BYTECODE,
    signer
  );
  let lootContract!: Contract;
  const deployLoot = async () => {
    console.log("Deploying DungeonLoot contract");
    lootContract = await LootFactory.deploy();
    console.log("Awaiting confirmations");
    await lootContract.deployed();
    console.log("Completed");
    console.log(`DungeonLoot Contract deployed at ${lootContract.address}`);
  };

  await deployLoot();
  await deployToken();
  // await Promise.all([deployToken(), deployLoot()]);

  // *Deploy Faucet*
  console.log("Deploying FAUCET contract");
  const FaucetFactory = new ethers.ContractFactory(
    FAUCET_ABI,
    FAUCET_BYTECODE,
    signer
  );
  const faucetContract = await FaucetFactory.deploy(gemsContract.address);
  console.log("Awaiting confirmations");
  await faucetContract.deployed();
  console.log("Completed");
  console.log(`FAUCET Contract deployed at ${faucetContract.address}`);

  // *Deploy NFT*
  console.log("Deploying NFT contract");
  const nftFactory = new ethers.ContractFactory(
    DEFENDER_ABI,
    DEFENDER_BYTECODE,
    signer
  );
  const defenderContract = await nftFactory.deploy(lootContract.address);
  console.log("Awaiting confirmations");
  await defenderContract.deployed();
  console.log("Completed");
  console.log(`NFT Contract deployed at ${defenderContract.address}`);

  // *Deploy Staking*
  console.log("Deploying Staking contract");
  const stakingFactory = new ethers.ContractFactory(
    STAKE_ABI,
    STAKE_BYTECODE,
    signer
  );
  const stakingContract = await stakingFactory.deploy(
    defenderContract.address,
    lootContract.address,
    gemsContract.address
  );
  console.log("Awaiting confirmations");
  await stakingContract.deployed();
  console.log("Completed");
  console.log(`Staking Contract deployed at ${stakingContract.address}`);

  return {
    gemsContract,
    faucetContract,
    lootContract,
    defenderContract,
    stakingContract,
  };
}

async function updatePackage({
  gemsContract,
  faucetContract,
  lootContract,
  defenderContract,
  stakingContract,
}: {
  gemsContract: Contract;
  faucetContract: Contract;
  lootContract: Contract;
  defenderContract: Contract;
  stakingContract: Contract;
}) {
  const file = await fs.readFile("index.ts", { encoding: "utf8" });
  const lines = file.split("\n");
  const lastIdx = lines.length - 1;
  lines[
    lastIdx - 4
  ] = `export const GEMS_CONTRACT_ADDRESS = '${gemsContract.address}';`;
  lines[
    lastIdx - 3
  ] = `export const FAUCET_CONTRACT_ADDRESS = '${faucetContract.address}';`;
  lines[
    lastIdx - 2
  ] = `export const LOOT_CONTRACT_ADDRESS = '${lootContract.address}';`;
  lines[
    lastIdx - 1
  ] = `export const DEFENDER_CONTRACT_ADDRESS = '${defenderContract.address}';`;
  lines[
    lastIdx
  ] = `export const STAKE_CONTRACT_ADDRESS = '${stakingContract.address}';`;
  await fs.writeFile("index.ts", lines.join("\n"), { encoding: "utf8" });

  const packageJsonStr = await fs.readFile("package.json", {
    encoding: "utf8",
  });
  const packageJson = JSON.parse(packageJsonStr);
  const version = packageJson.version.split(".");
  version[2] = (parseInt(version[2]) + 1).toString();
  packageJson.version = version.join(".");
  await fs.writeFile(
    "package.json",
    JSON.stringify(packageJson, undefined, 2),
    { encoding: "utf8" }
  );
}

async function main() {
  // const { signer } = await connectToWallet();
  const [signer] = await ethers.getSigners();
  const {
    gemsContract,
    faucetContract,
    lootContract,
    defenderContract,
    stakingContract,
  } = await deploy(signer);

  console.log(`GEMS_CONTRACT_ADDRESS = '${gemsContract.address}'`);
  console.log(`FAUCET_CONTRACT_ADDRESS = '${faucetContract.address}'`);
  console.log(`LOOT_CONTRACT_ADDRESS = '${lootContract.address}'`);
  console.log(`NFT_CONTRACT_ADDRESS = '${defenderContract.address}'`);
  console.log(`STAKE_CONTRACT_ADDRESS = '${stakingContract.address}'`);

  await updatePackage({
    gemsContract,
    faucetContract,
    lootContract,
    defenderContract,
    stakingContract,
  });

  await setup({
    gemsContract,
    stakingContract,
    faucetContract,
    lootContract,
    defenderContract,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
