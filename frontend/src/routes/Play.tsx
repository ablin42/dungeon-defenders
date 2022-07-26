// *EXTERNALS*
import { useEthers } from '@usedapp/core';
import { useLocation } from 'react-router-dom';
import React from 'react';

// *INTERNALS*
import { useStakes, useTokenURI } from '../hooks';
import { getExpiration, extendNFTObject } from '../utils';
import Game from '../components/Game';
import Prepare from '../components/Play/Prepare';
import { StakeState } from '../types';

export default function Play() {
  const { state } = useLocation() as { state: StakeState };
  const { account } = useEthers();
  const stakes = useStakes(account);
  const URI = useTokenURI(stakes && +stakes.tokenId);
  const NFTObject = extendNFTObject(URI, stakes && +stakes.tokenId);
  const { expired } = getExpiration(stakes);

  if (NFTObject && (stakes?.isClaimable || expired)) {
    return (
      <>
        <div className="container mt-5">
          <div className="container-decorated bg-dark">
            <h1 className="text-center mb-3">Game Ended</h1>
            <Prepare account={account || ''} NFT={NFTObject} />
          </div>
        </div>
      </>
    );
  } else {
    return <Game state={state} />;
  }
}
