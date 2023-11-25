/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "AccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AccessControl__factory>;
    getContractFactory(
      name: "IAccessControl",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccessControl__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC4906",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC4906__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "ERC721URIStorage",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721URIStorage__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "DefenderFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DefenderFactory__factory>;
    getContractFactory(
      name: "DefenderInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DefenderInterface__factory>;
    getContractFactory(
      name: "DefenderUtils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DefenderUtils__factory>;
    getContractFactory(
      name: "DungeonDefenders",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DungeonDefenders__factory>;
    getContractFactory(
      name: "ILoot",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILoot__factory>;
    getContractFactory(
      name: "GemsFaucet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GemsFaucet__factory>;
    getContractFactory(
      name: "Gems",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Gems__factory>;
    getContractFactory(
      name: "DungeonLoot",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DungeonLoot__factory>;
    getContractFactory(
      name: "LootFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LootFactory__factory>;
    getContractFactory(
      name: "LootInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LootInterface__factory>;
    getContractFactory(
      name: "Staking",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Staking__factory>;

    getContractAt(
      name: "AccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AccessControl>;
    getContractAt(
      name: "IAccessControl",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccessControl>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC4906",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC4906>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC20Burnable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20Burnable>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "ERC721URIStorage",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721URIStorage>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "DefenderFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DefenderFactory>;
    getContractAt(
      name: "DefenderInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DefenderInterface>;
    getContractAt(
      name: "DefenderUtils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DefenderUtils>;
    getContractAt(
      name: "DungeonDefenders",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DungeonDefenders>;
    getContractAt(
      name: "ILoot",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ILoot>;
    getContractAt(
      name: "GemsFaucet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GemsFaucet>;
    getContractAt(
      name: "Gems",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Gems>;
    getContractAt(
      name: "DungeonLoot",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DungeonLoot>;
    getContractAt(
      name: "LootFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LootFactory>;
    getContractAt(
      name: "LootInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LootInterface>;
    getContractAt(
      name: "Staking",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Staking>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
