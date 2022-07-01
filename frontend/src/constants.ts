// *EXTERNALS*
import { ethers } from 'ethers';

export const GEMS_CONTRACT_ADDRESS = '0x2812E79AD5644CD27A74c618fF257b7f5805E684';
export const FAUCET_CONTRACT_ADDRESS = '0x8c5C54d36b10Dc9eE1344469B30dF62F03346873';
export const LOOT_CONTRACT_ADDRESS = '0x263f7074fD5900144DF0ACd61CF4a06DCA16d28f';
export const NFT_CONTRACT_ADDRESS = '0x55CF0a999bF0C3AbF4A2A3B9A4b9514fE2046cd4';
export const STAKE_CONTRACT_ADDRESS = '0xC70783a4d2179ffD3ED96ec974976754900F42b1';
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
