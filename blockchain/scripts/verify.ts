const hre = require("hardhat");

async function main() {
  const GEMS = "0xc172ff167a33de36bccfFC817c65c073f13c4ff5";
  const NFT = "0xE4973222EcC5d57c1Ac099c212fCB32d279B35C6";
  const STAKING = "0x2DD3359b16DFA5a4670C8F844e23fA73bC68aE65";

  // VERIFY TOKEN
  const verifyToken = hre.run("verify:verify", {
    address: GEMS,
    constructorArguments: [],
  });

  // VERIFY SHARES
  const verifyShares = hre.run("verify:verify", {
    address: NFT,
    constructorArguments: [],
  });

  // VERIFY BONDS
  const verifyBonds = hre.run("verify:verify", {
    address: STAKING,
    constructorArguments: [NFT],
  });

  await Promise.all([verifyToken, verifyShares, verifyBonds]);
  console.log("Verified contracts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
