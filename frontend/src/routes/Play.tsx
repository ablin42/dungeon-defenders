// *EXTERNALS*
import { useEthers } from '@usedapp/core';
import React from 'react';

// *INTERNALS*
import { useStakes } from '../hooks';
import Game from '../components/Game';
import Claim from '../components/Claim';

export default function Play() {
  const { account } = useEthers();
  const stakes = useStakes(account);

  const timestamp = stakes && +stakes.timestamp;
  const expiration = timestamp && timestamp + 60 * 30;
  const now = parseInt((Date.now() / 1000).toString());
  const expired = expiration && expiration < now;

  if (stakes?.isClaimable || expired) {
    return <Claim />;
  } else {
    return <Game />;
  }
}
