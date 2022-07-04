// *EXTERNALS*
import { TransactionState, TransactionStatus, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

// *INTERNALS*
import Error from '../components/Error';
import LoadingBtn from '../components/LoadingBtn';
import { API_ADDRESS, STATUS_TYPES } from '../constants';
import { initializeGame } from '../game/Index';
import { Loot, useDefender, useEmergency, useLoot, useStakes, useUnstake } from '../hooks';
import { sendTx, handleTxStatus } from '../utils';

type State = {
  owner: string;
  defenderId: string | 0;
  weaponId: 0;
  armorId: 0;
  bootsId: 0;

  gemsAmount: 0;
};

const DEFAULT_LOOT: Loot = {
  health: 0,
  speed: 0,
  strength: 0,
  defense: 0,
  background: 0,
  weapon: 0,
  armor: 0,
  boots: 0,
};

const triggerRewardAllocation = async (account: string | undefined) => {
  toast.success('You won, GG !');

  const res = await fetch(`${API_ADDRESS}/v1/game/${account}/allocateRewards`, { method: 'POST' });
  if (res.status !== 200) toast.error('Failed to allocate rewards, emergency withdrawal needed');
};

export default function Play() {
  const navigate = useNavigate();
  const { account } = useEthers();
  const { state } = useLocation() as { state: State };
  const stakes = useStakes(account && account);
  const weaponId = (state && state.weaponId) || (state && state.defenderId);
  const defender = useDefender(stakes && +stakes.tokenId); //?state.defenderId
  const weapon = useLoot(stakes && +stakes.weaponId);
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const { state: emergencyState, send: sendEmergency } = useEmergency();
  const [init, setInit] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAllocatingRewards, setIsAllocatingRewards] = useState(false);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([unstakeState, emergencyState]);
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
    setSTATES([unstakeState, emergencyState]);
  }, [unstakeState, emergencyState]);

  useEffect(() => {
    const successHandler = () => {
      setTimeout(async () => {
        navigate(`/NFT/user/${account}`, {
          replace: false,
        });
      }, 5000);
    };
    handleTxStatus(STATES, STATUS, handleStateChange, successHandler);
  }, [STATES]);

  const unstake = async () => {
    sendUnstake();
  };
  const emergency = async () => {
    sendEmergency();
  };

  const onGameOver = async () => {
    if (isGameOver) {
      return;
    }
    setIsGameOver(true);
    setIsAllocatingRewards(true);
    await triggerRewardAllocation(account);
    setIsAllocatingRewards(false);
  };

  useEffect(() => {
    if (init || stakes?.isClaimable) {
      return;
    }

    console.log(defender, weapon);
    if (!defender || (weaponId && !weapon)) {
      return;
    }

    setInit(true);
  }, [defender, weapon]);

  useEffect(() => {
    if (!init || stakes?.isClaimable) {
      return;
    }

    if (!defender || (weaponId && !weapon)) {
      return;
    }

    initializeGame('game', { onGameOver, defender, weapon: weapon ?? DEFAULT_LOOT });
  }, [init]);

  if (stakes?.isClaimable || expired || isPending[0]) {
    return (
      <div className="container text-center mb-5">
        <div className="col-4 offset-4 mt-5">
          <h1 className="mb-5">Claim your rewards 🎉</h1>
          <ul className="list-group text-start">
            <li className="list-group-item">
              <b>
                Rewarded Exp -{' '}
                {(stakes && stakes.rewardedExpAmount.toNumber()) || (
                  <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </b>
            </li>
            <li className="list-group-item">
              <b>
                Rewarded Gems -{' '}
                {(stakes && ethers.utils.formatEther(stakes.rewardedGemsAmount)) || (
                  <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </b>
            </li>
            <li className="list-group-item">
              <b>
                Loot Reward -{' '}
                {(stakes && stakes.wasRewardLoot ? '✅' : '❌') || (
                  <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </b>
            </li>
          </ul>
          <div className="mt-2">
            {stakes?.isClaimable &&
              (isPending[0] ? (
                <LoadingBtn text={'Claiming...'} type="success" width="100%" />
              ) : (
                <button onClick={() => sendTx(unstake)} className="btn btn-lg btn-success w-100 ">
                  Claim
                </button>
              ))}
            {expired && !stakes.isClaimable && (
              <div className="mb-2 mt-2">
                <div className="text-muted mb-2">
                  An issue might&rsquo;ve occured with your game, use this button to retrieve your stake
                </div>
                {isPending[1] ? (
                  <LoadingBtn text={'Withdrawing...'} type="danger" width="100%" />
                ) : (
                  <>
                    <button onClick={() => sendTx(emergency)} className="btn btn-lg btn-danger w-100 ">
                      Emergency Withdraw
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!account || !stakes || (stakes && !stakes.isInitialized))
    return <Error title="Game not found, check your collection" url={!account ? '/' : `/NFT/user/${account}`} />;

  return (
    <>
      <h2 className="text-center mt-5 mb-5">Defend Some Dungeons</h2>
      {isAllocatingRewards ? (
        <div className="text-center">
          Allocating Rewards
          <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      <div className="container col-4">
        <div id="game"></div>
      </div>
    </>
  );
}
