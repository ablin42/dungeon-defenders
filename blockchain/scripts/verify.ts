import { GEMS_CONTRACT_ADDRESS, FAUCET_CONTRACT_ADDRESS, LOOT_CONTRACT_ADDRESS, STAKE_CONTRACT_ADDRESS, DEFENDER_CONTRACT_ADDRESS } from "../index";

const hre = require("hardhat");

export async function verifyContracts() {  
  // *VERIFY GEMS*
  const verifyGems = hre.run("verify:verify", {
    address: GEMS_CONTRACT_ADDRESS,
    constructorArguments: [],
  });

  // *VERIFY FAUCET*
  const verifyFaucet = hre.run("verify:verify", {
    address: FAUCET_CONTRACT_ADDRESS,
    constructorArguments: [GEMS_CONTRACT_ADDRESS],
  });

  // *VERIFY LOOT*
  const verifyLoot = hre.run("verify:verify", {
    address: LOOT_CONTRACT_ADDRESS,
    constructorArguments: [],
  });

  // *VERIFY NFT*
  const verifyNFT = hre.run("verify:verify", {
    address: DEFENDER_CONTRACT_ADDRESS,
    constructorArguments: [LOOT_CONTRACT_ADDRESS],
  });

  // *VERIFY STAKING*
  const verifyStaking = hre.run("verify:verify", {
    address: STAKE_CONTRACT_ADDRESS,
    constructorArguments: [
      DEFENDER_CONTRACT_ADDRESS,
      LOOT_CONTRACT_ADDRESS,
      GEMS_CONTRACT_ADDRESS,
    ],
  });

  await Promise.all([
    verifyGems,
    verifyFaucet,
    verifyLoot,
    verifyNFT,
    verifyStaking,
  ]);
  console.log("Verified contracts");
}

async function main() {
  await verifyContracts();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
