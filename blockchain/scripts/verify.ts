const hre = require("hardhat");

async function main() {
  const GEMS = "0x5CF7EBA340cb884ED87f48778f5473eF47bbE981";
  const LOOT = "0x3b4CFc8861ec9657c647A3064070c558ED4E3892";
  const NFT = "0xf27f5F0B206fD3AA4418bBf3ba46A39a353109aC";
  const STAKING = "0xb53a5c6E5d0435D90De49e6FE1E9eD7e8166522A";

  // *VERIFY GEMS*
  const verifyGems = hre.run("verify:verify", {
    address: GEMS,
    constructorArguments: [],
  });

  // *VERIFY LOOT*
  const verifyLoot = hre.run("verify:verify", {
    address: LOOT,
    constructorArguments: [],
  });

  // *VERIFY NFT*
  const verifyNFT = hre.run("verify:verify", {
    address: NFT,
    constructorArguments: [LOOT],
  });

  // *VERIFY STAKING*
  const verifyStaking = hre.run("verify:verify", {
    address: STAKING,
    constructorArguments: [NFT, LOOT, GEMS],
  });

  await Promise.all([verifyGems, verifyLoot, verifyNFT, verifyStaking]);
  console.log("Verified contracts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
