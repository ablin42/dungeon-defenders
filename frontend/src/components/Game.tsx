// *EXTERNALS*
import { useEthers } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// *INTERNALS*
import Error from '../components/Misc/Error';
import { API_ADDRESS } from '../constants';
import { initializeGame } from '../game/Index';
import { Loot, useDefender, useLoot, useStakes } from '../hooks';
import { StakeState } from '../types';

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

const Game = ({ state }: { state: StakeState }) => {
  const { account } = useEthers();
  const stakes = useStakes(account);
  const weaponId = (state && state.weaponId) || (state && state.defenderId);
  const defender = useDefender(stakes && stakes.tokenId.toNumber());
  const weapon = useLoot(stakes && +stakes.weaponId);
  const [isLoading, setIsLoading] = useState(true);
  const [init, setInit] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAllocatingRewards, setIsAllocatingRewards] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1250);
  }, []);

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
    if (init || stakes?.isClaimable) return;
    if (!defender || (weaponId && !weapon)) return;

    setInit(true);
  }, [defender, weapon]);

  useEffect(() => {
    if (!init || stakes?.isClaimable) return;
    if (!defender || (weaponId && !weapon)) return;

    initializeGame('game', { onGameOver, defender, weapon: weapon ?? DEFAULT_LOOT });
  }, [init]);

  if (!isLoading && (!account || !stakes || (stakes && !stakes.isInitialized)))
    return (
      <Error title="Game not found, check your collection" error="" url={!account ? '/' : `/Collection/${account}`} />
    );

  return (
    <div className="container smaller-container pt-5 pb-5 ">
      <div className="container-decorated">
        <h2 className="text-center mb-3">Find the Treasure 💰</h2>
        {isAllocatingRewards ? (
          <div className="text-center">
            Allocating Rewards
            <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
        <div
          className="d-flex justify-content-center shadow"
          id="game"
          style={{ width: 'fit-content', margin: 'auto' }}
        ></div>
      </div>
    </div>
  );
};

export default Game;
