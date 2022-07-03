// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Error from '../components/Error';
import { API_ADDRESS } from '../constants';

// *INTERNALS*
import { initializeGame } from '../game/Index';
import { Loot, useDefender, useLoot, useStakes } from '../hooks';

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

const triggerRewardAllocation = async (account: string, defenderId: string | number) => {
  toast.success('You won, GG !');

  const res = await fetch(`${API_ADDRESS}/v1/game/${account}/allocateRewards`, { method: 'POST' });
  if (res.status !== 200) toast.error('Failed to allocate rewards, emergency withdrawal needed');

  window.location.href = `/NFT/${defenderId}`;
};

export default function Play() {
  const { state } = useLocation() as { state: State };
  if (state === null) return <Error title="Game not found, check your collection" />;

  const stakes = useStakes(state.owner);
  const defender = useDefender(state.defenderId);
  const weapon = useLoot(state.weaponId);
  const [init, setInit] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isAllocatingRewards, setIsAllocatingRewards] = useState(false);

  const onGameOver = async () => {
    if (isGameOver) {
      return;
    }
    setIsGameOver(true);
    setIsAllocatingRewards(true);
    await triggerRewardAllocation(state.owner, state.defenderId);
    setIsAllocatingRewards(false);
  };

  useEffect(() => {
    if (init) {
      return;
    }

    console.log(defender, weapon);
    if (!defender || (state.weaponId && !weapon)) {
      return;
    }

    setInit(true);
  }, [defender, weapon]);

  useEffect(() => {
    if (!init) {
      return;
    }

    if (!defender || (state.weaponId && !weapon)) {
      return;
    }

    initializeGame('game', { onGameOver, defender, weapon: weapon ?? DEFAULT_LOOT });
  }, [init]);

  if (stakes?.isClaimable) {
    return (
      <Error
        title="Claim your rewards to start a new game"
        btnText="Go to your defender's page"
        url={`/NFT/${state.defenderId}`}
        error=""
      />
    );
  }

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
