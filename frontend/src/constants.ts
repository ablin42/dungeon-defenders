import { ethers } from 'ethers';

export const NFT_CONTRACT_ADDRESS = '0xaE2E510fA01ceD5B5ec868AD35Dd670eD0Fcc4cE';
export const STAKE_CONTRACT_ADDRESS = '0x5FD57A1188471660e9fF52169ba447525BaE5fDb';
export const GEMS_CONTRACT_ADDRESS = '0x514D1Dc5eD43312dc1E558384cFa34D26D56263d';
export const LOOT_CONTRACT_ADDRESS = '0x38225033888A93095456C7aDc17439AC78590992'; // doesn't exist yet
export const API_ADDRESS = 'http://localhost:3001';
export const GEMS_TOTAL_SUPPLY = ethers.utils.parseEther('100000000');
export const STATUS_TYPES = {
  NONE: 'None',
  PENDING: 'PendingSignature',
  MINING: 'Mining',
  SUCCESS: 'Success',
  FAIL: 'Fail',
  EXCEPTION: 'Exception',
};
