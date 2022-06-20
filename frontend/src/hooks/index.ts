import { ethers } from 'ethers';
import { useContractFunction } from '@usedapp/core';
import { NFT_ABI } from '../ABI/NFT';
import { NFT_CONTRACT_ADDRESS } from '../constants';

const contractInterface = new ethers.utils.Interface(NFT_ABI);

// ? Forced to use any here due to a weird issue
const contract: any = new ethers.Contract(NFT_CONTRACT_ADDRESS, contractInterface);

export function useMint() {
  const { state, send } = useContractFunction(contract, 'safeMint', {});
  return { state, send };
}

export function useTransfer() {
  const { state, send } = useContractFunction(contract, 'transferFrom', {});
  return { state, send };
}
