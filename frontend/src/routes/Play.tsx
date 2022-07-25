// *EXTERNALS*
import { useEthers } from '@usedapp/core';
import { useLocation } from 'react-router-dom';
import { Buffer } from 'buffer';
import React from 'react';
// *INTERNALS*

import { useStakes, useTokenURI } from '../hooks';
import { getExpiration } from '../utils';
import Game from '../components/Game';
import Prepare from '../components/Play/Prepare';

type State = {
  owner: string;
  defenderId: string | 0;
  weaponId: 0;
  armorId: 0;
  bootsId: 0;

  gemsAmount: 0;
};

export default function Play() {
  const { state } = useLocation() as { state: State };
  const { account } = useEthers();
  const stakes = useStakes(account);
  const URI = useTokenURI((stakes && +stakes.tokenId) || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject && stakes?.tokenId) NFTObject.tokenId = +stakes.tokenId;
  const { expired } = getExpiration(stakes);

  if (NFTObject && (stakes?.isClaimable || expired)) {
    return (
      <>
        <h1 className="text-center mt-4" style={{ marginBottom: '-25px' }}>
          Game Ended
        </h1>
        <Prepare account={account || ''} NFT={NFTObject} />
      </>
    );
  } else {
    return <Game state={state} />;
  }
}
