// import "dotenv/config";
// import * as factoryJson from "../../artifacts/contracts/Loot/LootFactory.sol/LootFactory.json";
// import { LootFactory } from "../../typechain";
// import { connectToWallet } from "../utils";
// import { Contract, ethers } from "ethers";

// /**
//  * Create loot
//  * > createLoot <LootFactoryContractAddress> <LootName>
//  */
// async function main() {
//   const { signer } = await connectToWallet();

//   // Get inputs
//   if (process.argv.length < 3) throw new Error("LootFactory address missing");
//   const lootFactoryAddress = process.argv[2];
//   if (process.argv.length < 4) throw new Error("loot name missing");
//   const lootName = process.argv[3];

//   const lootFactory = new Contract(
//     lootFactoryAddress,
//     factoryJson.abi,
//     signer
//   ) as LootFactory;
  
//   console.log(`Creating random loot with name=${lootName}`);
//   const tx = await lootFactory.createRandomLoot(ethers.utils.formatBytes32String(lootName));
//   const result = await tx.wait();
//   const newDefenderGeneratedEvent = result.events?.find(e => e.event === 'NewLootGenerated');
//   const tokenId = newDefenderGeneratedEvent?.args ? newDefenderGeneratedEvent.args.lootId.toNumber() : 0;
//   console.log(`Created tokenId=${tokenId}`);
//   const defender = await lootFactory.loot(tokenId);
//   console.log(JSON.stringify(defender));
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
