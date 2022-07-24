// *EXTERNALS*
import { TransactionState, TransactionStatus, useEthers } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// *INTERNALS*
import LoadingBtn from '../components/Misc/LoadingBtn';
import { STATUS_TYPES } from '../constants';
import { useEmergency, useStakes } from '../hooks';
import { sendTx, handleTxStatus } from '../utils';

export default function EmergencyWithdraw() {
  const navigate = useNavigate();
  const { account } = useEthers();
  const stakes = useStakes(account);
  const { state: emergencyState, send: sendEmergency } = useEmergency();
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([emergencyState]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const timestamp = stakes && +stakes.timestamp;
  const expiration = timestamp && timestamp + 60 * 30;
  const now = parseInt((Date.now() / 1000).toString());
  const expired = expiration && expiration < now;

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([emergencyState]);
  }, [emergencyState]);

  useEffect(() => {
    const successHandler = () => {
      navigate(`/Collection/${account}`, {
        replace: false,
      });
    };
    handleTxStatus(STATES, STATUS, handleStateChange, successHandler);
  }, [STATES]);

  const emergency = async () => {
    sendEmergency();
  };

  if (stakes?.isClaimable || expired) {
    return (
      <div className="container col-4 offset-4 text-center pt-5">
        {expired && !stakes.isClaimable ? (
          <div className="mb-2 mt-2">
            {isPending[1] ? (
              <LoadingBtn text={'Withdrawing...'} type="danger" width="100%" />
            ) : (
              <>
                <button onClick={() => sendTx(emergency)} className="btn btn-lg btn-danger w-100 ">
                  Emergency Withdraw
                </button>
              </>
            )}
            <div className="text-muted mt-2">Use this button if your game is stuck</div>
          </div>
        ) : null}
      </div>
    );
  }

  return <></>;
}
