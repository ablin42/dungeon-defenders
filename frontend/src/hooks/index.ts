import { ethers } from 'ethers';
import { useContractFunction, useCall } from '@usedapp/core';
import { Contract } from '@ethersproject/contracts';
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
const GEMSContractInterface = new ethers.utils.Interface(GEMS_ABI);
const LOOTContractInterface = new ethers.utils.Interface(LOOT_ABI);

const NFTContract = new Contract(NFT_CONTRACT_ADDRESS, NFTContractInterface);
const STAKEContract = new ethers.Contract(STAKE_CONTRACT_ADDRESS, STAKEContractInterface);
const GEMSContract = new ethers.Contract(GEMS_CONTRACT_ADDRESS, GEMSContractInterface);
const LOOTContract = new ethers.Contract(LOOT_CONTRACT_ADDRESS, LOOTContractInterface);

// *NFT HOOKS*
export function useMint() {
  const { state, send } = useContractFunction(NFTContract, 'safeMint', {});
  return { state, send };
}

// Approve the NFT to be used by our STAKING contract
export function useApprove() {
  const { state, send } = useContractFunction(NFTContract, 'setApprovalForAll', {});
  return { state, send };
}

// Equip the loot attached to an NFT
export function useEquip() {
  const { state, send } = useContractFunction(NFTContract, 'equipLoot', {});
  return { state, send };
}

// Unequip the loot attached to an NFT
export function useUnequip() {
  const { state, send } = useContractFunction(NFTContract, 'unequipLoot', {});
  return { state, send };
}

// Check aesthetics
export function useSlots(tokenId: string | number) {
  const { value, error } =
    useCall(
      tokenId && {
        contract: NFTContract,
        method: 'getSlots',
        args: [tokenId],
      },
    ) ?? {};

  // ? Circumventing a bug that probably happened due to an NFT
  // ?  being minted before server listener for events, and then picked it up
  if (!value) return [0, 0, 0];
  if (error) {
    console.error(`Error fetching slots for Defender #${tokenId}`, error.message);
    return [0, 0, 0];
  }
  const slots = [+value?.slots[1], +value?.slots[2], +value?.slots[3]];
  return slots;
}

// Check if user has approved STAKING contract for all NFTs
export function useAllowance(userAddress: string) {
  const { value, error } =
    useCall(
      userAddress && {
        contract: NFTContract,
        method: 'isApprovedForAll',
        args: [userAddress, STAKE_CONTRACT_ADDRESS],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching NFT allowance for ${userAddress}`, error.message);
    return undefined;
  }
  return value?.[0];
}

// Get Token URI
export function useTokenURI(tokenId: string | number) {
  const { value, error } =
    useCall(
      tokenId && {
        contract: NFTContract,
        method: 'tokenURI',
        args: [tokenId],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching Token ${tokenId} URI`, error.message);
    return undefined;
  }

  const uri = value?.[0].substr(29);
  return uri;
}

// Get Owner of tokenId
export function useOwnerOf(tokenId: string | number) {
  const { value, error } =
    useCall(
      tokenId && {
        contract: NFTContract,
        method: 'ownerOf',
        args: [tokenId],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching Token ${tokenId} URI`, error.message);
    return undefined;
  }

  return value?.[0];
}

// ? NFT contract should handle items that *could* be needed to level up
// TODO Level up NFT
// export function useLevelUp() {
//   const { state, send } = useContractFunction(NFTContract, 'levelUp', {});
//   return { state, send };
// }

// TODO Evolve the NFT
// // ? NFT contract should handle items that *could* be needed to evolve
// export function useEvolve() {
//   const { state, send } = useContractFunction(NFTContract, 'evolve', {});
//   return { state, send };
// }

// *GEMS HOOKS*
// Approve GEMS to be used by our STAKING contract
export function useApproveGEMS() {
  const { state, send } = useContractFunction(GEMSContract, 'approve', {});
  return { state, send };
}

export function useBurnGEMS() {
  const { state, send } = useContractFunction(GEMSContract, 'burn', {});
  return { state, send };
}

// Check if user has approved STAKING contract for all NFTs
export function useAllowanceGEMS(userAddress: string) {
  const { value, error } =
    useCall(
      userAddress && {
        contract: GEMSContract,
        method: 'allowance',
        args: [userAddress, STAKE_CONTRACT_ADDRESS],
      },
    ) ?? {};
  const allowance = value ? parseInt(ethers.utils.formatEther(value[0])) : undefined;

  if (error) {
    console.error(`Error fetching gems allowance for ${userAddress}`, error.message);
    return undefined;
  }
  return allowance;
}

// *STAKING HOOKS*
export function useStake() {
  const { state, send } = useContractFunction(STAKEContract, 'stake', {});
  return { state, send };
}

export function useUnstake() {
  const { state, send } = useContractFunction(STAKEContract, 'unstake', {});
  return { state, send };
}

// Check if user has an NFT staked
export function useIsStaked(userAddress: string) {
  const { value, error } =
    useCall(
      userAddress && {
        contract: STAKEContract,
        method: 'isStaking',
        args: [userAddress],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching staking status for ${userAddress}`, error.message);
    return undefined;
  }

  return value?.[0];
}

// Get user stakes info
export function useStakes(userAddress: string) {
  const { value, error } =
    useCall(
      userAddress && {
        contract: STAKEContract,
        method: 'stakes',
        args: [userAddress],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching staking status for ${userAddress}`, error.message);
    return undefined;
  }

  return value;
}

// *LOOT HOOKS*
// Mint loot
export function useMintLoot() {
  const { state, send } = useContractFunction(LOOTContract, 'safeMint', {});
  return { state, send };
}

// Approve the LOOT NFTs
export function useApproveLoot() {
  const { state, send } = useContractFunction(LOOTContract, 'setApprovalForAll', {});
  return { state, send };
}

// Check if user has approved STAKING contract for all LOOT NFTs
export function useAllowanceLoot(userAddress: string) {
  const { value, error } =
    useCall(
      userAddress && {
        contract: LOOTContract,
        method: 'isApprovedForAll',
        args: [userAddress, STAKE_CONTRACT_ADDRESS],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching NFT allowance for ${userAddress}`, error.message);
    return undefined;
  }
  return value?.[0];
}
// Get Token URI for LOOT
export function useTokenURILoot(tokenId: string | number) {
  const { value, error } =
    useCall(
      tokenId && {
        contract: LOOTContract,
        method: 'tokenURI',
        args: [tokenId],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching Token ${tokenId} URI`, error.message);
    return undefined;
  }

  const uri = value?.[0].substr(29);
  return uri;
}

// Get Owner of tokenId for LOOT
export function useOwnerOfLoot(tokenId: string | number) {
  const { value, error } =
    useCall(
      tokenId && {
        contract: LOOTContract,
        method: 'ownerOf',
        args: [tokenId],
      },
    ) ?? {};

  if (error) {
    console.error(`Error fetching Token ${tokenId} URI`, error.message);
    return undefined;
  }

  return value?.[0];
}
