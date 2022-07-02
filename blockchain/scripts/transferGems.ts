import "dotenv/config";
import { Gems } from "../typechain";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { GEMS_ABI, GEMS_CONTRACT_ADDRESS } from "../index";

/**
 * Retrieve a token uri by token id
 * > transferGems <GemsContract> <ReceiverAddress> <Amount>
 */
async function main() {
  const [signer] = await ethers.getSigners();

  // Get inputs
  if (process.argv.length < 3) throw new Error("received address missing");
  const receiverAddress = process.argv[2];
  if (process.argv.length < 4) throw new Error("amount missing");
  const amountStr = process.argv[3];
  const amount = parseInt(amountStr);

  const gems = new Contract(
    GEMS_CONTRACT_ADDRESS,
    GEMS_ABI,
    signer
  ) as Gems;
  
  console.log(`Transfering ${amount} gems to address=${receiverAddress}`);
  const tx = await gems.transfer(receiverAddress, ethers.utils.parseEther(amountStr));
  await tx.wait()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
