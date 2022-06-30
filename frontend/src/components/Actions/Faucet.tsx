import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { NETWORK_EXPLORER, STATUS_TYPES, FAUCET_CONTRACT_ADDRESS } from '../../constants';
import { useDeposit, useClaim, useGemsBalance } from '../../hooks/index';
import toast from 'react-hot-toast';
import LoadingBtn from '../LoadingBtn';
import { TransactionStatus } from '@usedapp/core';

const Faucet = () => {
  const [isPending, setIsPending] = useState(false);
  const [amount, setAmount] = useState('0');
  const { state: claimState, send: sendClaim } = useClaim();
  const { state: depositState, send: sendDeposit } = useDeposit();
  const [STATUS, setSTATUS] = useState<Array<string>>([claimState.status, depositState.status]);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([claimState, depositState]);
  const balance = useGemsBalance(FAUCET_CONTRACT_ADDRESS) || 0;

  useEffect(() => {
    const newSTATES = [claimState, depositState];
    const newSTATUS = [claimState.status, depositState.status];
    setSTATUS(newSTATUS);
    setSTATES(newSTATES);
  }, [claimState, depositState]);

  useEffect(() => {
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const targetedState = STATES[successIndex];
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[successIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);

      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
            {targetedState.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
        {
          icon: '✅',
          position: 'top-right',
        },
      );
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[statusIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);

      toast.error(`Tx Error: ${STATES[statusIndex].errorMessage}`, {
        icon: '❌',
        position: 'top-right',
      });
    }
  }, [STATUS]);

  const claim = async () => {
    sendClaim();
  };

  const deposit = async () => {
    sendDeposit(ethers.utils.parseEther(amount));
  };

  // TODO extract to a separate component
  // eslint-disable-next-line @typescript-eslint/ban-types
  const sendTx = async (tx: Function) => {
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    tx();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="col-8 offset-2 mt-4">
      <label htmlFor="gemsAmount">Gems Faucet</label>
      <div className="input-group text-start mt-2 mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="500"
          aria-label="deposit gems"
          onChange={(e) => handleChange(e)}
          value={amount}
        />
        {isPending ? (
          <LoadingBtn />
        ) : (
          <button onClick={() => sendTx(deposit)} className="btn btn-lg btn-primary">
            Deposit
          </button>
        )}
      </div>
      {isPending ? (
        <LoadingBtn fullWidth="w-100" type="success" />
      ) : (
        <button onClick={() => sendTx(claim)} className="btn btn-lg btn-success w-100 ">
          Claim 500 GEMS
        </button>
      )}
      <span className="text-muted">{+balance} GEMS Available</span>
    </div>
  );
};

export default Faucet;
