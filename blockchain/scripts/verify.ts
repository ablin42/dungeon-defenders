const hre = require("hardhat");

async function main() {
  const GEMS = "0x514D1Dc5eD43312dc1E558384cFa34D26D56263d";
  const NFT = "0xaE2E510fA01ceD5B5ec868AD35Dd670eD0Fcc4cE";
  const STAKING = "0x5FD57A1188471660e9fF52169ba447525BaE5fDb";

  // VERIFY GEMS
  const verifyGems = hre.run("verify:verify", {
    address: GEMS,
    constructorArguments: [],
  });

  // VERIFY NFT
  const verifyNFT = hre.run("verify:verify", {
    address: NFT,
    constructorArguments: [],
  });

  // VERIFY STAKING
  const verifyStaking = hre.run("verify:verify", {
    address: STAKING,
    constructorArguments: [NFT, GEMS],
  });

  await Promise.all([verifyGems, verifyNFT, verifyStaking]);
  console.log("Verified contracts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
