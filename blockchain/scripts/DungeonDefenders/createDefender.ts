import "dotenv/config";
import * as factoryJson from "../../artifacts/contracts/DungeonDefenders/DefenderFactory.sol/DefenderFactory.json";
import { DefenderFactory } from "../../typechain";
import { connectToWallet } from "../utils";
import { Contract, ethers } from "ethers";
import { DEFENDER_CONTRACT_ADDRESS } from "../../index";

/**
 * Create a defender
 * > createDefender <DefenderFactoryContractAddress> <DefenderName>
 */
async function main() {
  const { signer } = await connectToWallet();

  // Get inputs
  if (process.argv.length < 3) throw new Error("defender name missing");
  const defenderName = process.argv[2];

  const defenderFactory = new Contract(
    DEFENDER_CONTRACT_ADDRESS,
    factoryJson.abi,
    signer
  ) as DefenderFactory;

  // console.log(`Creating random defender with name=${defenderName}`);
  // const tx = await defenderFactory.createRandomDefender(ethers.utils.formatBytes32String(defenderName));
  // const result = await tx.wait();
  // const newDefenderGeneratedEvent = result.events?.find(e => e.event === 'NewDefenderGenerated');
  // const tokenId = newDefenderGeneratedEvent?.args ? newDefenderGeneratedEvent.args.defenderId.toNumber() : 0;
  // console.log(`Created tokenId=${tokenId}`);
  // const defender = await defenderFactory.defenders(tokenId);
  // console.log(JSON.stringify(defender));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
