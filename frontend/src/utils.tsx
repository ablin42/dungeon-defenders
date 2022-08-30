/* eslint-disable @typescript-eslint/ban-types */
// *EXTERNALS*
import React from 'react';
import toast from 'react-hot-toast';
import { TransactionStatus } from '@usedapp/core';
import { Buffer } from 'buffer';

// *INTERNALS*
import { NETWORK_EXPLORER, STATUS_TYPES } from './constants';

export const sendTx = async (tx: Function) => {
  toast.loading(`Tx Pending...`, { duration: 1000 * 10 });
  tx();
};

export const handleTxStatus = (
  STATES: Array<TransactionStatus>,
  STATUS: Array<string>,
  handler: Function,
  callback?: Function,
) => {
  if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
    const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
    const targetedState = STATES[successIndex];
    handler(STATES, successIndex);

    toast.success(
      <>
        Tx Success:
        <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
          {targetedState.receipt?.transactionHash.substring(0, 12)}...
        </a>
      </>,
    );

    if (callback) callback(successIndex);
  }
  if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
    const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
    handler(STATES, statusIndex);

    toast.error(`Tx Error: ${STATES[statusIndex].errorMessage}`);
  }
};

export const getExpiration = (stakes: any) => {
  const timestamp = stakes && +stakes.timestamp;
  const expiration = timestamp && timestamp + 60 * 30;
  const now = parseInt((Date.now() / 1000).toString());
  const expired = expiration && expiration < now;

  return { timestamp, expiration, now, expired };
};

export const extendNFTObject = (URI: string, tokenId: string | number | undefined) => {
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = tokenId;

  return NFTObject;
};
