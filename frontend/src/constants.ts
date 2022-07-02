// *EXTERNALS*
import { ethers } from 'ethers';

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
