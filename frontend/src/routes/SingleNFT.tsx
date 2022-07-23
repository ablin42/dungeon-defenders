// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { Buffer } from 'buffer';

// *INTERNALS*
import { useTokenURI, useOwnerOf, useStakes } from '../hooks/index';
import BasicNFTDisplay from '../components/Card/BasicNFTDisplay';
import Prepare from '../components/Play/Prepare';

export default function SingleNFT() {
  /* HOOKS */
  const params = useParams();
  const { nftId } = params;
  const owner = useOwnerOf(nftId || 0);
  const { account } = useEthers();
  const URI = useTokenURI(nftId || 0);
  const stakes = account && useStakes(account);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;

  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;
  const isUserStakedToken = userStaking && nftId == stakedId;
  /* STATE */

  return (
    <>
      {!owner || !account || (owner !== account && !isUserStakedToken) ? (
        <BasicNFTDisplay NFT={NFTObject} />
      ) : (
        NFTObject && <Prepare account={account} NFT={NFTObject} />
      )}
    </>
  );
}
