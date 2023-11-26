const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config();

import {
  DEFENDER_ABI,
  DEFENDER_CONTRACT_ADDRESS,
  GemsContract,
  GEMS_ABI,
  GEMS_CONTRACT_ADDRESS,
  LOOT_ABI,
  LOOT_CONTRACT_ADDRESS,
  STAKE_ABI,
  STAKE_CONTRACT_ADDRESS,
} from "../index";

import { Contract } from "ethers";

import { Gems } from "../typechain";

export async function setup({
  gemsContract,
  faucetContract,
  stakingContract,
  defenderContract,
  lootContract,
}: {
  gemsContract: Gems;
  faucetContract: Contract;
  stakingContract: Contract;
  lootContract: Contract;
  defenderContract: Contract;
}) {
  const ALLOCATING_ADDRESS = "0xA5Bee0D628445024f8278974BdD2d26c4a140f76";

  await gemsContract.transfer(
    stakingContract.address,
    ethers.utils.parseEther("2000000")
  );
  await gemsContract.transfer(
    faucetContract.address,
    ethers.utils.parseEther("2000000")
  );
  await defenderContract.grantRole(
    await defenderContract.OPERATOR_ROLE(),
    stakingContract.address
  );
  await lootContract.grantRole(
    await lootContract.OPERATOR_ROLE(),
    stakingContract.address
  );
  await stakingContract.grantRole(
    await stakingContract.OPERATOR_ROLE(),
    ALLOCATING_ADDRESS
  );
}

async function main() {
  const [signer] = await ethers.getSigners();

  const gemsContract = new Contract(
    GEMS_CONTRACT_ADDRESS,
    GEMS_ABI,
    signer
  ) as GemsContract;

  const defenderContract = new Contract(
    DEFENDER_CONTRACT_ADDRESS,
    DEFENDER_ABI,
    signer
  );

  const lootContract = new Contract(LOOT_CONTRACT_ADDRESS, LOOT_ABI, signer);

  const stakingContract = new Contract(
    STAKE_CONTRACT_ADDRESS,
    STAKE_ABI,
    signer
  );

  const faucetContract = new Contract(
    STAKE_CONTRACT_ADDRESS,
    STAKE_ABI,
    signer
  );

  await setup({
    gemsContract,
    stakingContract,
    faucetContract,
    lootContract,
    defenderContract,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
