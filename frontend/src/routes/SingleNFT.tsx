// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import CardWrapper from '../components/Card/CardWrapper';
import { useTokenURI, useOwnerOf, useStakes } from '../hooks/index';
import Prepare from '../components/Play/Prepare';
import { extendNFTObject } from '../utils';

export default function SingleNFT() {
  /* HOOKS */
  const params = useParams();
  const { nftId } = params;
  const owner = useOwnerOf(nftId);
  const { account } = useEthers();
  const stakes = useStakes(account);
  const URI = useTokenURI(nftId);
  const NFTObject = extendNFTObject(URI, nftId);

  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;
  const isUserStakedToken = userStaking && nftId == stakedId;
  /* STATE */

  return (
    <div className="mt-5">
      {!owner || !account || (owner !== account && !isUserStakedToken) ? (
        <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
          <a href="#" onClick={() => history.back()}>
            <FontAwesomeIcon icon={faCircleLeft} fontSize={25} />
          </a>
          <div className="col-8 offset-2">{NFTObject && <CardWrapper NFT={NFTObject} />}</div>
        </div>
      ) : (
        <div className="container mt-5">
          <div className="container-decorated bg-dark">
            {NFTObject && <Prepare account={account} NFT={NFTObject} />}
          </div>
        </div>
      )}
    </div>
  );
}
