import "dotenv/config";
import * as factoryJson from "../../artifacts/contracts/DungeonDefenders/DefenderFactory.sol/DefenderFactory.json";
import { DefenderFactory } from "../../typechain";
import { connectToWallet } from "../utils";
import { Contract, ethers } from "ethers";

/**
 * Retrieve a defender by index
 * > getDefender <DefenderFactoryAddress> <DefenderIndex>
 */
async function main() {
  const { signer } = await connectToWallet();

  // Get inputs
  if (process.argv.length < 3) throw new Error("DefenderFactory address missing");
  const defenderFactoryAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("defender index missing");
  const defenderIdxStr = process.argv[3];
  const defenderIdx = parseInt(defenderIdxStr);

  const defenderFactory = new Contract(
    defenderFactoryAddress,
    factoryJson.abi,
    signer
  ) as DefenderFactory;
  
  console.log(`Retrieving defender at index=${defenderIdx}`);
  const defender = await defenderFactory.defenders(defenderIdx);
  console.log(`Name: ${ethers.utils.parseBytes32String(defender.name)}`);
  console.log(`Level: ${defender.level}`);
  console.log(`== ATTRIBUTES ==`);
  console.log(`Health: ${defender.health}`);
  console.log(`Speed: ${defender.speed}`);
  console.log(`Strength: ${defender.strength}`);
  console.log(`Defense: ${defender.defense}`);
  console.log(`== STATS ==`);
  console.log(`Wins: ${defender.dungeonWins}`);
  console.log(`Losses: ${defender.dungeonLosses}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
