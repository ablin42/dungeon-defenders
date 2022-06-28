const hre = require("hardhat");

async function main() {
  const GEMS = "0x820162941958dF6541Cf36A99e70970A8d4AF504";
  const NFT = "0xc08543dEE25ACAf995A0e57202Da11353308061A";
  const STAKING = "0x6b1CB5e5be7B4c4164459F8aBD5bdb0809E0a7BD";

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
