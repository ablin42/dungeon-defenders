const hre = require("hardhat");

async function main() {
  const GEMS = "0xc172ff167a33de36bccfFC817c65c073f13c4ff5";
  const NFT = "0xE4973222EcC5d57c1Ac099c212fCB32d279B35C6";
  const STAKING = "0x3D5D40bD1Fb1FEAec28488741E1a25dA13DD1227";

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
    constructorArguments: [NFT],
  });

  await Promise.all([verifyGems, verifyNFT, verifyStaking]);
  console.log("Verified contracts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
