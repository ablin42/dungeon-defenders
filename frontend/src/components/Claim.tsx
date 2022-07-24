// *EXTERNALS*
import { TransactionState, TransactionStatus, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import LoadingBtn from '../components/Misc/LoadingBtn';
import { STATUS_TYPES } from '../constants';
import { useStakes, useUnstake } from '../hooks';
import { sendTx, handleTxStatus } from '../utils';

export default function Claim() {
  const navigate = useNavigate();
  const { account } = useEthers();
  const stakes = useStakes(account);
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([unstakeState]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([unstakeState]);
  }, [unstakeState]);

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

  return (
    <div className="container col-4 offset-4 text-center pt-5">
      <div className="container-decorated col-10 offset-1 p-5">
        <h1 className="mb-3">Claim your rewards 🎉</h1>
        <div className="col-10 offset-1">
          <ul className="list-group text-start shadow-sm">
            <li className="list-group-item list-reward">
              <span>Rewarded XP</span>
              <b>
                {stakes && stakes.rewardedExpAmount.toNumber() >= 0 ? (
                  stakes.rewardedExpAmount.toNumber()
                ) : (
                  <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </b>
            </li>
            <li className="list-group-item list-reward">
              <span>
                Rewarded Gems <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} />
              </span>
              <b>
                {(stakes && +ethers.utils.formatEther(stakes.rewardedGemsAmount)) || (
                  <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </b>
            </li>
            <li className="list-group-item list-reward">
              <span>Found Loot</span>
              <b>
                {(stakes && stakes.wasRewardLoot ? '✅' : '❌') || (
                  <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </b>
            </li>
          </ul>
          <div className="mt-2">
            {stakes?.isClaimable ? (
              isPending[0] ? (
                <LoadingBtn text={'Claiming...'} type="primary" width="100%" />
              ) : (
                <button onClick={() => sendTx(unstake)} className="btn btn-lg btn-primary w-100 ">
                  Claim 💰
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
