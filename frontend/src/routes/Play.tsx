// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// *INTERNALS*
import { initializeGame } from '../game/Index';
import { Loot, useDefender, useLoot } from '../hooks';

type State = {
  owner: string;
  defenderId: string | number;
  weaponId: number;
  armorId: number;
  bootsId: number;

  gemsAmount: number;
};

export default function Play() {
  const { state } = useLocation() as { state: State };
  const defender = useDefender(state.defenderId);
  const weapon = useLoot(state.weaponId);
  const [init, setInit] = useState(false);

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

    initializeGame('game', { ownerAddress: state.owner, defenderId: state.defenderId, defender, weapon });
  }, [init])

  return (
    <>
      <h2 className="text-center mt-5 mb-5">Defend Some Dungeons</h2>
      <div className="container col-4">
        <div id="game"></div>
      </div>
    </>
  );
}
