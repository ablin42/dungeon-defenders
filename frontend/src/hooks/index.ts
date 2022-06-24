import { ethers } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { NFT_ABI } from '../ABI/NFT';
import { STAKE_ABI } from '../ABI/STAKE';
import { GEMS_ABI } from '../ABI/GEMS';
import { LOOT_ABI } from '../ABI/LOOT';
import {
  NFT_CONTRACT_ADDRESS,
  STAKE_CONTRACT_ADDRESS,
  GEMS_CONTRACT_ADDRESS,
  LOOT_CONTRACT_ADDRESS,
} from '../constants';

const NFTContractInterface = new ethers.utils.Interface(NFT_ABI);
const STAKEContractInterface = new ethers.utils.Interface(STAKE_ABI);
const GEMSContractInterface = new ethers.utils.Interface(LOOT_ABI);
const LOOTContractInterface = new ethers.utils.Interface(GEMS_ABI);

// ? Forced to use any here due to a weird issue
const NFTContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFTContractInterface);
const STAKEContract = new ethers.Contract(STAKE_CONTRACT_ADDRESS, STAKEContractInterface);
const GEMSContract = new ethers.Contract(GEMS_CONTRACT_ADDRESS, GEMSContractInterface);
const LOOTContract = new ethers.Contract(LOOT_CONTRACT_ADDRESS, LOOTContractInterface);

export function useMint() {
  const { state, send } = useContractFunction(NFTContract, 'safeMint', {});
  return { state, send };
}

// TODO
export function useBurn() {
  const { state, send } = useContractFunction(NFTContract, 'safeBurn', {});
  return { state, send };
}

export function useTransfer() {
  const { state, send } = useContractFunction(NFTContract, 'transferFrom', {});
  return { state, send };
}

// Approve the NFT to be used by our STAKING contract
export function useApprove() {
  const { state, send } = useContractFunction(NFTContract, 'approve', {});
  return { state, send };
}

// TODO Level up NFT
// ? NFT contract should handle items that *could* be needed to level up
export function useLevelUp() {
  const { state, send } = useContractFunction(NFTContract, 'levelUp', {});
  return { state, send };
}

// TODO Evolve the NFT
// ? NFT contract should handle items that *could* be needed to evolve
export function useEvolve() {
  const { state, send } = useContractFunction(NFTContract, 'evolve', {});
  return { state, send };
}

// ? Stake should handle items sent aswell (eg burn 100 gems & stake your nft to play with bonus)
export function useStake() {
  const { state, send } = useContractFunction(STAKEContract, 'stake', {});
  return { state, send };
}

export function useUnstake() {
  const { state, send } = useContractFunction(STAKEContract, 'unstake', {});
  return { state, send };
}
