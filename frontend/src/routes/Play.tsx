// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// *INTERNALS*
import { initializeGame } from '../game/Index';
import { Loot, useDefender, useLoot } from '../hooks';

type State = {
  owner: string;
  defenderId: string | 0,
  weaponId: 0,
  armorId: 0,
  bootsId: 0,

  gemsAmount: 0,
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
}

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

    initializeGame('game', { ownerAddress: state.owner, defenderId: state.defenderId, defender, weapon: weapon ?? DEFAULT_LOOT });
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
