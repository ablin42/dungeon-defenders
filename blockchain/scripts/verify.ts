const hre = require("hardhat");

async function main() {
  const GEMS_CONTRACT_ADDRESS = "0x2812E79AD5644CD27A74c618fF257b7f5805E684";
  const FAUCET_CONTRACT_ADDRESS = "0x8c5C54d36b10Dc9eE1344469B30dF62F03346873";
  const LOOT_CONTRACT_ADDRESS = "0x263f7074fD5900144DF0ACd61CF4a06DCA16d28f";
  const NFT_CONTRACT_ADDRESS = "0x55CF0a999bF0C3AbF4A2A3B9A4b9514fE2046cd4";
  const STAKE_CONTRACT_ADDRESS = "0xC70783a4d2179ffD3ED96ec974976754900F42b1";

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
    address: NFT_CONTRACT_ADDRESS,
    constructorArguments: [LOOT_CONTRACT_ADDRESS],
  });

  // *VERIFY STAKING*
  const verifyStaking = hre.run("verify:verify", {
    address: STAKE_CONTRACT_ADDRESS,
    constructorArguments: [
      NFT_CONTRACT_ADDRESS,
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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
