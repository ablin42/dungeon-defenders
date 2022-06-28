const hre = require("hardhat");

async function main() {
  const GEMS = "0x514D1Dc5eD43312dc1E558384cFa34D26D56263d";
  const NFT = "0xaE2E510fA01ceD5B5ec868AD35Dd670eD0Fcc4cE";
  const STAKING = "0x3E1aaCAE1B5a1D0C20Fd0e855823160c0DeaAB1C";

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
