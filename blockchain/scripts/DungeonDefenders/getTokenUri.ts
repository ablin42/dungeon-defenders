import "dotenv/config";
import * as dungeonDefenderJson from "../../artifacts/contracts/DungeonDefenders/DungeonDefenders.sol/DungeonDefenders.json";
import { DungeonDefenders } from "../../typechain";
import { connectToWallet } from "../utils";
import { Contract, ethers } from "ethers";

/**
 * Retrieve a token uri by token id
 * > getTokenUri <DungeonDefenderAddress> <DefenderIndex>
 */
async function main() {
  const { signer } = await connectToWallet();

  // Get inputs
  if (process.argv.length < 3) throw new Error("DungeonDefender address missing");
  const dungeonDefenderAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("defender index missing");
  const defenderIdxStr = process.argv[3];
  const defenderIdx = parseInt(defenderIdxStr);

  const dungeonDefenders = new Contract(
    dungeonDefenderAddress,
    dungeonDefenderJson.abi,
    signer
  ) as DungeonDefenders;
  
  console.log(`Retrieving token uri at index=${defenderIdx}`);
  const tokenURI = await dungeonDefenders.tokenURI(defenderIdx);
  console.log(tokenURI)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
