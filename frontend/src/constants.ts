import { ethers } from 'ethers';

export const GEMS_CONTRACT_ADDRESS = '0x5CF7EBA340cb884ED87f48778f5473eF47bbE981';
export const LOOT_CONTRACT_ADDRESS = '0x3b4CFc8861ec9657c647A3064070c558ED4E3892';
export const NFT_CONTRACT_ADDRESS = '0xf27f5F0B206fD3AA4418bBf3ba46A39a353109aC';
export const STAKE_CONTRACT_ADDRESS = '0xAf2e9397b7aF856DA22106075a849400a7cF8F42';
export const API_ADDRESS = 'http://localhost:3001';
export const GEMS_TOTAL_SUPPLY = ethers.utils.parseEther('100000000');
export const NETWORK_EXPLORER = 'https://goerli.etherscan.io';
export const STATUS_TYPES = {
  NONE: 'None',
  PENDING: 'PendingSignature',
  MINING: 'Mining',
  SUCCESS: 'Success',
  FAIL: 'Fail',
  EXCEPTION: 'Exception',
};
