import React, { useEffect } from 'react';
import { initializeGame } from '../game/Index';

export default function Play() {
    useEffect(() => {
        initializeGame('game');
    }, [])

  return (
    <>
      <h2 className="text-center mt-5 mb-5">Defend Some Dungeons</h2>
      <div className="container col-4">
        <div id="game"></div>
      </div>
    </>
  );
}
