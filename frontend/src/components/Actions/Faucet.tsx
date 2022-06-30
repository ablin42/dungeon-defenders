// *EXTERNALS*
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { TransactionStatus } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
// *INTERNALS*
import { NETWORK_EXPLORER, STATUS_TYPES, FAUCET_CONTRACT_ADDRESS } from '../../constants';
import { useDeposit, useClaim, useWithdraw, useOwnerOfFaucet, useGemsBalance } from '../../hooks/index';
import LoadingBtn from '../LoadingBtn';
import { sendTx } from '../../utils';

interface ActionProps {
  userAddress: string;
}

const Faucet = ({ userAddress }: ActionProps) => {
  // *HOOKS*
  const { state: claimState, send: sendClaim } = useClaim();
  const { state: depositState, send: sendDeposit } = useDeposit();
  const { state: withdrawState, send: sendWithdraw } = useWithdraw();
  const balance = useGemsBalance(FAUCET_CONTRACT_ADDRESS) || 0;
  const owner = useOwnerOfFaucet();
  // *STATE*
  const [isPending, setIsPending] = useState(false);
  const [amount, setAmount] = useState('0');
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([claimState, depositState, withdrawState]);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = JSON.parse(JSON.stringify(STATES));
    newSTATES[index].status = STATUS_TYPES.NONE;
    setSTATES(newSTATES);
    setIsPending(false);
  };

  useEffect(() => {
    setSTATES([claimState, depositState, withdrawState]);
  }, [claimState, depositState, withdrawState]);

  useEffect(() => {
    const STATUS = STATES.map((state) => state.status as string);
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const targetedState = STATES[successIndex];
      handleStateChange(STATES, successIndex);

      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
            {targetedState.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
      );
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
      handleStateChange(STATES, statusIndex);

      toast.error(`Tx Error: ${STATES[statusIndex].errorMessage}`);
    }
  }, [STATES]);

  const claim = async () => {
    sendClaim();
  };
  const withdraw = async () => {
    sendWithdraw();
  };
  const deposit = async () => {
    sendDeposit(ethers.utils.parseEther(amount));
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
      {owner &&
        owner === userAddress &&
        (isPending ? (
          <div className="mb-3">
            <LoadingBtn fullWidth="w-100" type="danger" />
          </div>
        ) : (
          <button onClick={() => sendTx(withdraw)} className="btn btn-lg btn-danger w-100 mb-3">
            Withdraw
          </button>
        ))}
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
