/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ILootInterface extends ethers.utils.Interface {
  functions: {
    "loot(uint256)": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "loot", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "loot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;

  events: {};
}

export class ILoot extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ILootInterface;

  functions: {
    loot(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        [
          string,
          BigNumber,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number
        ] & {
          name: string;
          minLevelRequired: BigNumber;
          health: number;
          speed: number;
          strength: number;
          defense: number;
          background: number;
          weapon: number;
          armor: number;
          boots: number;
        }
      ] & {
        loot: [
          string,
          BigNumber,
          number,
          number,
          number,
          number,
          number,
          number,
          number,
          number
        ] & {
          name: string;
          minLevelRequired: BigNumber;
          health: number;
          speed: number;
          strength: number;
          defense: number;
          background: number;
          weapon: number;
          armor: number;
          boots: number;
        };
      }
    >;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { owner: string }>;
  };

  loot(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      BigNumber,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ] & {
      name: string;
      minLevelRequired: BigNumber;
      health: number;
      speed: number;
      strength: number;
      defense: number;
      background: number;
      weapon: number;
      armor: number;
      boots: number;
    }
  >;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    loot(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
      ] & {
        name: string;
        minLevelRequired: BigNumber;
        health: number;
        speed: number;
        strength: number;
        defense: number;
        background: number;
        weapon: number;
        armor: number;
        boots: number;
      }
    >;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    loot(tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    loot(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}