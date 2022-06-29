import "dotenv/config";
import * as factoryJson from "../../artifacts/contracts/Loot/LootFactory.sol/LootFactory.json";
import { LootFactory } from "../../typechain";
import { connectToWallet } from "../utils";
import { Contract, ethers } from "ethers";

/**
 * Retrieve loot by index
 * > getLoot <LootFactoryContractAddress> <LootIndex>
 */
async function main() {
  const { signer } = await connectToWallet();

  // Get inputs
  if (process.argv.length < 3) throw new Error("LootFactory address missing");
  const lootFactoryAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("loot index missing");
  const lootIdxStr = process.argv[3];
  const lootIdx = parseInt(lootIdxStr);

  const lootFactory = new Contract(
    lootFactoryAddress,
    factoryJson.abi,
    signer
  ) as LootFactory;
  
  console.log(`Retrieving loot at index=${lootIdx}`);
  const loot = await lootFactory.loot(lootIdx);
  console.log(`Name: ${ethers.utils.parseBytes32String(loot.name)}`);
  console.log(`Min Level Required: ${loot.minLevelRequired}`);
  console.log(`== ATTRIBUTES ==`);
  console.log(`Health: ${loot.health}`);
  console.log(`Speed: ${loot.speed}`);
  console.log(`Strength: ${loot.strength}`);
  console.log(`Defense: ${loot.defense}`);
  console.log(`== TYPE ==`);
  console.log(`Background: ${loot.background}`);
  console.log(`Weapon: ${loot.weapon}`);
  console.log(`Armor: ${loot.armor}`);
  console.log(`Boots: ${loot.boots}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
