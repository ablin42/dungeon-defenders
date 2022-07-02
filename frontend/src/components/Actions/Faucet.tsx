// *EXTERNALS*
import { ethers } from 'ethers';
import { TransactionStatus } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import { FAUCET_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';

// *INTERNALS*
import { STATUS_TYPES, GEMS_TOTAL_SUPPLY } from '../../constants';
import {
  useDeposit,
  useClaim,
  useWithdraw,
  useOwnerOfFaucet,
  useGemsBalance,
  useApproveGEMS,
  useAllowanceGEMS,
} from '../../hooks/index';
import LoadingBtn from '../LoadingBtn';
import { sendTx, handleTxStatus } from '../../utils';

interface ActionProps {
  userAddress: string;
}

const STATE_INDEX = {
  APPROVE: 0,
  CLAIM: 1,
  DEPOSIT: 2,
  WITHDRAW: 3,
};

const Faucet = ({ userAddress }: ActionProps) => {
  // *HOOKS*
  const { state: claimState, send: sendClaim } = useClaim();
  const { state: depositState, send: sendDeposit } = useDeposit();
  const { state: withdrawState, send: sendWithdraw } = useWithdraw();
  const { state: approveState, send: sendApprove } = useApproveGEMS();
  const allowance = useAllowanceGEMS(userAddress, FAUCET_CONTRACT_ADDRESS);
  const balance = useGemsBalance(FAUCET_CONTRACT_ADDRESS) || 0;
  const owner = useOwnerOfFaucet();
  // *STATE*
  const [amount, setAmount] = useState('0');
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([
    approveState,
    claimState,
    depositState,
    withdrawState,
  ]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as any[];
    newSTATES[index].status = STATUS_TYPES.NONE;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([approveState, claimState, depositState, withdrawState]);
  }, [approveState, claimState, depositState, withdrawState]);

  useEffect(() => {
    handleTxStatus(STATES, STATUS, handleStateChange);
  }, [STATES]);

  const claim = async () => {
    sendClaim();
  };
  const withdraw = async () => {
    sendWithdraw();
  };
  const approve = async () => {
    sendApprove(FAUCET_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
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
        {isPending[STATE_INDEX.APPROVE] && !allowance ? (
          <LoadingBtn />
        ) : (
          !allowance && (
            <button onClick={() => sendTx(approve)} className="btn btn-lg btn-primary">
              Approve GEMS
            </button>
          )
        )}
        {allowance && isPending[STATE_INDEX.DEPOSIT] ? (
          <LoadingBtn />
        ) : allowance ? (
          <button onClick={() => sendTx(deposit)} className="btn btn-lg btn-primary">
            Deposit
          </button>
        ) : null}
      </div>
      {owner &&
        owner === userAddress &&
        (isPending[STATE_INDEX.WITHDRAW] ? (
          <div className="mb-3">
            <LoadingBtn width="100%" type="danger" />
          </div>
        ) : (
          <button onClick={() => sendTx(withdraw)} className="btn btn-lg btn-danger w-100 mb-3">
            Withdraw
          </button>
        ))}
      {isPending[STATE_INDEX.CLAIM] ? (
        <LoadingBtn width="100%" type="success" />
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
