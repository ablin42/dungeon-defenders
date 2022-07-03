import "dotenv/config";
import * as utilsJson from "../../artifacts/contracts/DungeonDefenders/DefenderUtils.sol/DefenderUtils.json";
import { connectToWallet } from "../utils";
import { Contract } from "ethers";
import { DefenderUtils } from "../../typechain/DefenderUtils";
import { DEFENDER_CONTRACT_ADDRESS } from "../../index";

/**
 * Gains experience
 * > createDefender <DefenderUtilsContractAddress> <TokenId> <ExpToGain>
 */
async function main() {
  const { signer } = await connectToWallet();

  // Get inputs
  if (process.argv.length < 3) throw new Error("token id missing");
  const tokenIdStr = process.argv[2];
  const tokenId = parseInt(tokenIdStr);
  if (process.argv.length < 4) throw new Error("exp to gain missing");
  const expToGainStr = process.argv[3];
  const expToGain = parseInt(expToGainStr);

  const defenderUtils = new Contract(
    DEFENDER_CONTRACT_ADDRESS,
    utilsJson.abi,
    signer
  ) as DefenderUtils;
  
  console.log(`Gaining experience for token=${tokenId} exp=${expToGain}`);
  const tx = await defenderUtils.gainExperience(tokenId, expToGain);
  const result = await tx.wait();
  const defenderLeveledUpEvent = result.events?.find(e => e.event === 'DefenderLeveledUp');
  const level = defenderLeveledUpEvent?.args ? defenderLeveledUpEvent.args.level : 0;
  const totalExp = await defenderUtils.defenderExperience(tokenId);
  console.log(`Leveled up to level=${level} totalExp=${totalExp}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
