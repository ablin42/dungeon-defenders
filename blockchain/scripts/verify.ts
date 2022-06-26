const hre = require("hardhat");

async function main() {
  const GEMS = "0x38225033888A93095456C7aDc17439AC78590992";
  const NFT = "0xC91612d04531BE625a8f8195fb457e8ab73c39fa";
  const STAKING = "0x805B1f3fCcd90Cd694Bb58965e33ee3981B00Bf7";

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
