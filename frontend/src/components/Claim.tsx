// *EXTERNALS*
import { TransactionState, TransactionStatus, useEthers } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// *INTERNALS*
import LoadingBtn from '../components/Misc/LoadingBtn';
import { STATUS_TYPES } from '../constants';
import { useStakes, useUnstake, useEmergency } from '../hooks';
import { sendTx, handleTxStatus } from '../utils';

export default function Claim({ expired }: { expired: boolean | undefined | 0 | '' }) {
  const navigate = useNavigate();
  const { account } = useEthers();
  const stakes = useStakes(account);
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const { state: emergencyState, send: sendEmergency } = useEmergency();

  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([unstakeState, emergencyState]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([unstakeState, emergencyState]);
  }, [unstakeState, emergencyState]);

  useEffect(() => {
    const successHandler = () => {
      navigate(`/Collection/${account}`, {
        replace: false,
      });
    };
    handleTxStatus(STATES, STATUS, handleStateChange, successHandler);
  }, [STATES]);

  const unstake = async () => {
    sendUnstake();
  };
  const emergency = async () => {
    sendEmergency();
  };

  return (
    <div className="mt-2">
      {stakes?.isClaimable ? (
        isPending[0] ? (
          <LoadingBtn text={'Claiming...'} type="primary" width="100%" />
        ) : (
          <button onClick={() => sendTx(unstake)} className="btn btn-lg btn-primary w-100">
            Claim 💰
          </button>
        )
      ) : null}
      {expired && stakes?.isInitialized && !stakes.isClaimable ? (
        <>
          {isPending[1] ? (
            <LoadingBtn text={'Withdrawing...'} type="danger" width="100%" />
          ) : (
            <button onClick={() => sendTx(emergency)} className="btn btn-lg btn-danger w-100">
              Emergency Withdraw
            </button>
          )}
          <div className="text-muted text-center mt-2">
            Use this button if your game is stuck (or if you didn&lsquo;t finish the game in time)
          </div>
        </>
      ) : null}
    </div>
  );
}
