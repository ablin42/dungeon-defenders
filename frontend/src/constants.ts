import { ethers } from 'ethers';

export const NFT_CONTRACT_ADDRESS = '0xc08543dEE25ACAf995A0e57202Da11353308061A';
export const STAKE_CONTRACT_ADDRESS = '0x6b1CB5e5be7B4c4164459F8aBD5bdb0809E0a7BD';
export const GEMS_CONTRACT_ADDRESS = '0x820162941958dF6541Cf36A99e70970A8d4AF504';
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
