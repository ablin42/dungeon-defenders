import { ethers } from 'ethers';

export const NFT_CONTRACT_ADDRESS = '0xC91612d04531BE625a8f8195fb457e8ab73c39fa';
export const STAKE_CONTRACT_ADDRESS = '0x805B1f3fCcd90Cd694Bb58965e33ee3981B00Bf7';
export const GEMS_CONTRACT_ADDRESS = '0x38225033888A93095456C7aDc17439AC78590992';
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
