import { ethers } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { NFT_ABI } from '../ABI/NFT';
// import { STAKING_ABI } from '../ABI/STAKING';
import { NFT_CONTRACT_ADDRESS /* STAKING_CONTRACT_ADDRESS */ } from '../constants';

const NFTContractInterface = new ethers.utils.Interface(NFT_ABI);
// const STAKINGContractInterface = new ethers.utils.Interface(NFT_ABI);

// ? Forced to use any here due to a weird issue
const NFTContract: any = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFTContractInterface);
// const STAKINGContract: any = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKINGContractInterface);

export function useMint() {
  const { state, send } = useContractFunction(NFTContract, 'safeMint', {});
  return { state, send };
}

export function useBurn() {
  const { state, send } = useContractFunction(NFTContract, 'safeBurn', {});
  return { state, send };
}

export function useTransfer() {
  const { state, send } = useContractFunction(NFTContract, 'transferFrom', {});
  return { state, send };
}

// Approve the NFT to be used by our contract handling staking
export function useApprove() {
  const { state, send } = useContractFunction(NFTContract, 'approve', {});
  return { state, send };
}

// Level up NFT
// ? NFT contract should handle items that *could* be needed to level up
export function useLevelUp() {
  const { state, send } = useContractFunction(NFTContract, 'levelUp', {});
  return { state, send };
}

// Evolve the NFT
// ? NFT contract should handle items that *could* be needed to evolve
export function useEvolve() {
  const { state, send } = useContractFunction(NFTContract, 'evolve', {});
  return { state, send };
}

// TODO stake/unstake has to be implemented for the contract that will hold the NFT, not the nft contract itself like here
// ? Stake should handle items sent aswell (eg burn 100 gems & stake your nft to play with bonus)
export function useStake() {
  const { state, send } = useContractFunction(NFTContract, 'stake', {}); //STAKINGContract
  return { state, send };
}

export function useUnstake() {
  const { state, send } = useContractFunction(NFTContract, 'unstake', {}); //STAKINGContract
  return { state, send };
}
