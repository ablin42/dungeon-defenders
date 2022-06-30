import { ethers } from 'ethers';

export const GEMS_CONTRACT_ADDRESS = '0x6b21bc1cE9bc33c866A9BD3105679BdBDc79a059';
export const LOOT_CONTRACT_ADDRESS = '0x971b472084158a5b9dC2f72110E9f93Cf2c701Cf';
export const NFT_CONTRACT_ADDRESS = '0xEdd474Ad5DfC9f7171d7DD307Be0ecd96f3e5dd7';
export const STAKE_CONTRACT_ADDRESS = '0xdFe7d5FDe52512754da17845a9Bc71278722404C';
export const FAUCET_CONTRACT_ADDRESS = '0xb8E29dC8FED6804c91380ab080C4BD0B24D0772B';
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
