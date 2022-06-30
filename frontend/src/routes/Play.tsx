import React, { useEffect } from 'react';
import { initializeGame } from '../game/Index';
import { useLocation } from 'react-router-dom';

export default function Play() {
  const { state } = useLocation();

  useEffect(() => {
    initializeGame('game', state);
  }, []);

  return (
    <>
      <h2 className="text-center mt-5 mb-5">Defend Some Dungeons</h2>
      <div className="container col-4">
        <div id="game"></div>
      </div>
    </>
  );
}
