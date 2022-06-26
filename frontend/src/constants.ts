import { ethers } from 'ethers';

export const NFT_CONTRACT_ADDRESS = '0xE4973222EcC5d57c1Ac099c212fCB32d279B35C6';
export const STAKE_CONTRACT_ADDRESS = '0x3D5D40bD1Fb1FEAec28488741E1a25dA13DD1227';
export const GEMS_CONTRACT_ADDRESS = '0xc172ff167a33de36bccffc817c65c073f13c4ff5';
export const LOOT_CONTRACT_ADDRESS = '0xE4973222EcC5d57c1Ac099c212fCB32d279B35C6';
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
