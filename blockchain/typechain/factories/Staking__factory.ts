/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Staking, StakingInterface } from "../Staking";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract DefenderInterface",
        name: "_characterToken",
        type: "address",
      },
      {
        internalType: "contract LootInterface",
        name: "_lootToken",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_gemsToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "Claimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "defenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weaponId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "armorId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bootsId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gemsAmount",
        type: "uint256",
      },
    ],
    name: "NFTStaked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "defenderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "weaponId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "armorId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bootsId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardedAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardedExp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "wasRewardLoot",
        type: "bool",
      },
    ],
    name: "NFTUnstaked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STAKING_FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gemsAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "bool",
        name: "shouldRewardLoot",
        type: "bool",
      },
    ],
    name: "allocateRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "characterToken",
    outputs: [
      {
        internalType: "contract DefenderInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "gemsBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gemsToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_staker",
        type: "address",
      },
    ],
    name: "isStaking",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lootToken",
    outputs: [
      {
        internalType: "contract LootInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_defenderId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_weaponId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_armorId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bootsId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gemsAmount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "stakes",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "weaponId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "armorId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bootsId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gemsAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardedExpAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardedGemsAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wasRewardLoot",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isClaimable",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isInitialized",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405268056bc75e2d631000006004553480156200001e57600080fd5b506040516200213a3803806200213a833981016040819052620000419162000184565b6200006d7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92933620000bd565b6200007a600033620000bd565b600180546001600160a01b039485166001600160a01b031991821617909155600280549385169382169390931790925560038054919093169116179055620001f0565b620000c98282620000cd565b5050565b620000d9828262000157565b620000c9576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556200011362000180565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b3390565b60008060006060848603121562000199578283fd5b8351620001a681620001d7565b6020850151909350620001b981620001d7565b6040850151909250620001cc81620001d7565b809150509250925092565b6001600160a01b0381168114620001ed57600080fd5b50565b611f3a80620002006000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c80636f49712b116100ad578063d547741f11610071578063d547741f1461026d578063db2e21bc14610280578063db724cef14610288578063f460124d1461029b578063f5b541a6146102a35761012c565b80636f49712b1461022f578063836dfd5a1461024257806391d148541461024a578063a217fddf1461025d578063ba663954146102655761012c565b80632f2ff15d116100f45780632f2ff15d146101ce57806336568abe146101e15780634bdaa9d7146101f45780634ed1d020146102075780635d8c1b591461021a5761012c565b806301ffc9a714610131578063150b7a021461015a57806316934fc41461017a578063248a9ca3146101a45780632def6620146101c4575b600080fd5b61014461013f3660046117e0565b6102ab565b60405161015191906119fa565b60405180910390f35b61016d6101683660046116e3565b6102d6565b6040516101519190611a0e565b61018d6101883660046116ab565b610300565b6040516101519b9a99989796959493929190611df9565b6101b76101b2366004611799565b610362565b6040516101519190611a05565b6101cc610377565b005b6101cc6101dc3660046117b1565b6103c1565b6101cc6101ef3660046117b1565b6103e2565b6101cc610202366004611869565b610428565b6101cc610215366004611820565b610afc565b610222610bd9565b6040516101519190611918565b61014461023d3660046116ab565b610be8565b6101b7610c0f565b6101446102583660046117b1565b610c15565b6101b7610c3e565b610222610c43565b6101cc61027b3660046117b1565b610c52565b6101cc610c6e565b6101b76102963660046116ab565b610ce3565b610222610d64565b6101b7610d73565b60006001600160e01b03198216637965db0b60e01b14806102d057506102d082610d97565b92915050565b7f150b7a023d4804d13e8c85fb27262cb750cf6ba9f9dd3bb30d90f482ceeb4b1f95945050505050565b6005602081905260009182526040909120805460018201546002830154600384015460048501549585015460068601546007870154600890970154959794969395929493919290919060ff80821691610100810482169162010000909104168b565b60009081526020819052604090206001015490565b33600090815260056020526040902060080154610100900460ff166103b75760405162461bcd60e51b81526004016103ae90611d11565b60405180910390fd5b6103bf610db0565b565b6103ca82610362565b6103d381611367565b6103dd838361137b565b505050565b6103ea611400565b6001600160a01b0316816001600160a01b03161461041a5760405162461bcd60e51b81526004016103ae90611d8c565b6104248282611404565b5050565b61043133610be8565b1561044e5760405162461bcd60e51b81526004016103ae90611ca4565b80600454811015801561046957508061046633610ce3565b10155b6104855760405162461bcd60e51b81526004016103ae90611b54565b6001546040516331a9108f60e11b815233916001600160a01b031690636352211e906104b5908a90600401611a05565b60206040518083038186803b1580156104cd57600080fd5b505afa1580156104e1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061050591906116c7565b6001600160a01b03161461052b5760405162461bcd60e51b81526004016103ae90611a8b565b8415806105be57506002546040516331a9108f60e11b815233916001600160a01b031690636352211e90610563908990600401611a05565b60206040518083038186803b15801561057b57600080fd5b505afa15801561058f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105b391906116c7565b6001600160a01b0316145b6105da5760405162461bcd60e51b81526004016103ae90611b2b565b83158061066d57506002546040516331a9108f60e11b815233916001600160a01b031690636352211e90610612908890600401611a05565b60206040518083038186803b15801561062a57600080fd5b505afa15801561063e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066291906116c7565b6001600160a01b0316145b6106895760405162461bcd60e51b81526004016103ae90611d64565b82158061071c57506002546040516331a9108f60e11b815233916001600160a01b031690636352211e906106c1908790600401611a05565b60206040518083038186803b1580156106d957600080fd5b505afa1580156106ed573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071191906116c7565b6001600160a01b0316145b6107385760405162461bcd60e51b81526004016103ae90611b03565b6040518061016001604052808781526020018681526020018581526020018481526020018381526020016000815260200160045481526020014281526020016000151581526020016000151581526020016001151581525060056000336001600160a01b03166001600160a01b03168152602001908152602001600020600082015181600001556020820151816001015560408201518160020155606082015181600301556080820151816004015560a0820151816005015560c0820151816006015560e082015181600701556101008201518160080160006101000a81548160ff0219169083151502179055506101208201518160080160016101000a81548160ff0219169083151502179055506101408201518160080160026101000a81548160ff021916908315150217905550905050600360009054906101000a90046001600160a01b03166001600160a01b03166323b872dd3330856040518463ffffffff1660e01b81526004016108b09392919061192c565b602060405180830381600087803b1580156108ca57600080fd5b505af11580156108de573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610902919061177d565b50600154604051632142170760e11b81526001600160a01b03909116906342842e0e9061093790339030908b9060040161192c565b600060405180830381600087803b15801561095157600080fd5b505af1158015610965573d6000803e3d6000fd5b5050505060008511156109d957600254604051632142170760e11b81526001600160a01b03909116906342842e0e906109a690339030908a9060040161192c565b600060405180830381600087803b1580156109c057600080fd5b505af11580156109d4573d6000803e3d6000fd5b505050505b8315610a4657600254604051632142170760e11b81526001600160a01b03909116906342842e0e90610a139033903090899060040161192c565b600060405180830381600087803b158015610a2d57600080fd5b505af1158015610a41573d6000803e3d6000fd5b505050505b8215610ab357600254604051632142170760e11b81526001600160a01b03909116906342842e0e90610a809033903090889060040161192c565b600060405180830381600087803b158015610a9a57600080fd5b505af1158015610aae573d6000803e3d6000fd5b505050505b7f66dc28d15b556a8ca7bac4e88d4039f20f5dfa1a36eac111eacefc75b0bb18c4338787878787604051610aec96959493929190611984565b60405180910390a1505050505050565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929610b2681611367565b610b2f83610be8565b610b4b5760405162461bcd60e51b81526004016103ae90611c47565b6001600160a01b038316600090815260056020526040902060080154610100900460ff1615610b8c5760405162461bcd60e51b81526004016103ae90611bb2565b506001600160a01b0390911660009081526005602081905260409091206008810180546006830196909655910192909255151560ff1961ff00199093166101001792909216919091179055565b6001546001600160a01b031681565b6001600160a01b031660009081526005602052604090206008015462010000900460ff1690565b60045481565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b600081565b6003546001600160a01b031681565b610c5b82610362565b610c6481611367565b6103dd8383611404565b3360009081526005602052604090206008015462010000900460ff16610ca65760405162461bcd60e51b81526004016103ae90611ab6565b33600090815260056020526040902060070154610cc590610708611e4d565b42116103b75760405162461bcd60e51b81526004016103ae90611bf6565b6003546040516370a0823160e01b81526000916001600160a01b0316906370a0823190610d14908590600401611918565b60206040518083038186803b158015610d2c57600080fd5b505afa158015610d40573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102d09190611808565b6002546001600160a01b031681565b7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b6001600160e01b031981166301ffc9a760e01b14919050565b600060056000336001600160a01b03166001600160a01b03168152602001908152602001600020600601549050600060056000336001600160a01b03166001600160a01b03168152602001908152602001600020600501549050600060056000336001600160a01b03166001600160a01b0316815260200190815260200160002060080160009054906101000a900460ff169050600060056000336001600160a01b03166001600160a01b03168152602001908152602001600020600001549050600060056000336001600160a01b03166001600160a01b03168152602001908152602001600020600101549050600060056000336001600160a01b03166001600160a01b03168152602001908152602001600020600201549050600060056000336001600160a01b03166001600160a01b0316815260200190815260200160002060030154905060056000336001600160a01b03166001600160a01b0316815260200190815260200160002060008082016000905560018201600090556002820160009055600382016000905560048201600090556005820160009055600682016000905560078201600090556008820160006101000a81549060ff02191690556008820160016101000a81549060ff02191690556008820160026101000a81549060ff02191690555050600360009054906101000a90046001600160a01b03166001600160a01b031663a9059cbb33896040518363ffffffff1660e01b8152600401610fdf92919061196b565b602060405180830381600087803b158015610ff957600080fd5b505af115801561100d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611031919061177d565b50851561109d5760015460405163953b6a9160e01b81526001600160a01b039091169063953b6a919061106a9087908a90600401611deb565b600060405180830381600087803b15801561108457600080fd5b505af1158015611098573d6000803e3d6000fd5b505050505b600180546040516318b1b03f60e21b81526001600160a01b03909116916362c6c0fc916110ce918891600401611ddb565b600060405180830381600087803b1580156110e857600080fd5b505af11580156110fc573d6000803e3d6000fd5b5050600154604051632142170760e11b81526001600160a01b0390911692506342842e0e91506111349030903390899060040161192c565b600060405180830381600087803b15801561114e57600080fd5b505af1158015611162573d6000803e3d6000fd5b5050505060008311156111d657600254604051632142170760e11b81526001600160a01b03909116906342842e0e906111a39030903390889060040161192c565b600060405180830381600087803b1580156111bd57600080fd5b505af11580156111d1573d6000803e3d6000fd5b505050505b811561124357600254604051632142170760e11b81526001600160a01b03909116906342842e0e906112109030903390879060040161192c565b600060405180830381600087803b15801561122a57600080fd5b505af115801561123e573d6000803e3d6000fd5b505050505b80156112b057600254604051632142170760e11b81526001600160a01b03909116906342842e0e9061127d9030903390869060040161192c565b600060405180830381600087803b15801561129757600080fd5b505af11580156112ab573d6000803e3d6000fd5b505050505b8415611319576002546040516319f5473160e21b81526001600160a01b03909116906367d51cc4906112e6903390600401611950565b600060405180830381600087803b15801561130057600080fd5b505af1158015611314573d6000803e3d6000fd5b505050505b7fd6d89ba0c91aafdfed6ad3c6d5dbb7d8abba48bc451d875a04fe8e22003b297e33858585858c8c8c6040516113569897969594939291906119b7565b60405180910390a150505050505050565b61137881611373611400565b611487565b50565b6113858282610c15565b610424576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556113bc611400565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b3390565b61140e8282610c15565b15610424576000828152602081815260408083206001600160a01b03851684529091529020805460ff19169055611443611400565b6001600160a01b0316816001600160a01b0316837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b6114918282610c15565b6104245761149e816114e0565b6114a98360206114f2565b6040516020016114ba9291906118a3565b60408051601f198184030181529082905262461bcd60e51b82526103ae91600401611a23565b60606102d06001600160a01b03831660145b60606000611501836002611e65565b61150c906002611e4d565b67ffffffffffffffff81111561153257634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f19166020018201604052801561155c576020820181803683370190505b509050600360fc1b8160008151811061158557634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106115c257634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060006115e6846002611e65565b6115f1906001611e4d565b90505b6001811115611685576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061163357634e487b7160e01b600052603260045260246000fd5b1a60f81b82828151811061165757634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a90535060049490941c9361167e81611eb4565b90506115f4565b5083156116a45760405162461bcd60e51b81526004016103ae90611a56565b9392505050565b6000602082840312156116bc578081fd5b81356116a481611ee1565b6000602082840312156116d8578081fd5b81516116a481611ee1565b6000806000806000608086880312156116fa578081fd5b853561170581611ee1565b9450602086013561171581611ee1565b935060408601359250606086013567ffffffffffffffff80821115611738578283fd5b818801915088601f83011261174b578283fd5b813581811115611759578384fd5b89602082850101111561176a578384fd5b9699959850939650602001949392505050565b60006020828403121561178e578081fd5b81516116a481611ef6565b6000602082840312156117aa578081fd5b5035919050565b600080604083850312156117c3578182fd5b8235915060208301356117d581611ee1565b809150509250929050565b6000602082840312156117f1578081fd5b81356001600160e01b0319811681146116a4578182fd5b600060208284031215611819578081fd5b5051919050565b60008060008060808587031215611835578384fd5b8435935060208501359250604085013561184e81611ee1565b9150606085013561185e81611ef6565b939692955090935050565b600080600080600060a08688031215611880578081fd5b505083359560208501359550604085013594606081013594506080013592509050565b60007f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000825283516118db816017850160208801611e84565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161190c816028840160208801611e84565b01602801949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b039190911681526000602082015260400190565b6001600160a01b03929092168252602082015260400190565b6001600160a01b03969096168652602086019490945260408501929092526060840152608083015260a082015260c00190565b6001600160a01b03989098168852602088019690965260408701949094526060860192909252608085015260a084015260c0830152151560e08201526101000190565b901515815260200190565b90815260200190565b6001600160e01b031991909116815260200190565b6000602082528251806020840152611a42816040850160208701611e84565b601f01601f19169190910160400192915050565b6020808252818101527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604082015260600190565b60208082526011908201527026bab9ba1037bbb7103232b332b73232b960791b604082015260600190565b6020808252602d908201527f4e6f7420496e697469616c697a65643a20596f75206e65656420746f2073746160408201526c72742061206e65772067616d6560981b606082015260800190565b6020808252600e908201526d4d757374206f776e20626f6f747360901b604082015260600190565b6020808252600f908201526e26bab9ba1037bbb7103bb2b0b837b760891b604082015260600190565b602080825260409082018190527f496e73756666696369656e7420616d6f756e743a20596f75206e65656420746f908201527f2068617665206174206c65617374203130302067656d7320746f207374616b65606082015260800190565b60208082526024908201527f436c61696d61626c653a20416c726561647920616c6c6f6361746564207265776040820152636172647360e01b606082015260800190565b60208082526031908201527f546f6f206561726c793a20596f752063616e206f6e6c79207769746864726177604082015270206166746572203330206d696e7574657360781b606082015260800190565b6020808252603c908201527f4e6f74207374616b696e673a20706c61796572206e6565647320746f2073746160408201527f6b65206265666f726520616c6c6f636174696e67207265776172647300000000606082015260800190565b60208082526047908201527f416c7265616479207374616b696e673a204f6e6c79206f6e652063686172616360408201527f7465722070657220616464726573732063616e206265207374616b656420617460608201526620612074696d6560c81b608082015260a00190565b60208082526033908201527f4e6f7420636c61696d61626c653a20596f75206e65656420746f207761697420604082015272199bdc881d1a194819d85b59481d1bc8195b99606a1b606082015260800190565b6020808252600e908201526d26bab9ba1037bbb71030b936b7b960911b604082015260600190565b6020808252602f908201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560408201526e103937b632b9903337b91039b2b63360891b606082015260800190565b9182521515602082015260400190565b918252602082015260400190565b9a8b5260208b019990995260408a01979097526060890195909552608088019390935260a087019190915260c086015260e08501521515610100840152151561012083015215156101408201526101600190565b60008219821115611e6057611e60611ecb565b500190565b6000816000190483118215151615611e7f57611e7f611ecb565b500290565b60005b83811015611e9f578181015183820152602001611e87565b83811115611eae576000848401525b50505050565b600081611ec357611ec3611ecb565b506000190190565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038116811461137857600080fd5b801515811461137857600080fdfea2646970667358221220b8caa545991524351b8fff4fddade5ed10a0c5ddd7d46da02f6a36dd522f674e64736f6c63430008010033";

export class Staking__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _characterToken: string,
    _lootToken: string,
    _gemsToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Staking> {
    return super.deploy(
      _characterToken,
      _lootToken,
      _gemsToken,
      overrides || {}
    ) as Promise<Staking>;
  }
  getDeployTransaction(
    _characterToken: string,
    _lootToken: string,
    _gemsToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _characterToken,
      _lootToken,
      _gemsToken,
      overrides || {}
    );
  }
  attach(address: string): Staking {
    return super.attach(address) as Staking;
  }
  connect(signer: Signer): Staking__factory {
    return super.connect(signer) as Staking__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingInterface {
    return new utils.Interface(_abi) as StakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Staking {
    return new Contract(address, _abi, signerOrProvider) as Staking;
  }
}
