// *EXTERNALS*
import { ethers } from 'ethers';

export const API_ADDRESS = 'http://localhost:3001';
export const GEMS_TOTAL_SUPPLY = ethers.utils.parseEther('100000000');
export const NETWORK_EXPLORER = 'https://goerli.etherscan.io';
export const HARB_DONATION_ADDRESS = '0xCC61d2bb1A215f19922eCF81613bEa3253713371';
export const RAMSEY_DONATION_ADDRESS = '0x0';
export const STATUS_TYPES = {
  NONE: 'None',
  PENDING: 'PendingSignature',
  MINING: 'Mining',
  SUCCESS: 'Success',
  FAIL: 'Fail',
  EXCEPTION: 'Exception',
};

export const ADMIN_WHITELIST = ['0x68897d3c09C5019BfA59fc863f9d86d4583861EF'];
