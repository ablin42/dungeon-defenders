import React from 'react';
import { useParams } from 'react-router-dom';

import NFTCard from '../components/NFTCard';
import { useTokenURI, useOwnerOf } from '../hooks/index';
import { Buffer } from 'buffer';

export default function SingleNFT() {
  const params = useParams();
  const { nftId } = params;
  const URI = useTokenURI(nftId || 0);
  const owner = useOwnerOf(nftId || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;

  // TODO doesnt handle 0 results (show infinite loading)

  return (
    <div className="text-center mt-5 mb-5">
      <h2 className="mb-2">Oh, Great Defender !</h2>
      <div className="container col-4">
        {URI ? (
          <NFTCard NFT={NFTObject} owner={owner} />
        ) : (
          <div className="text-center" style={{ height: '65vh', display: 'flex', justifyContent: 'center' }}>
            <span
              style={{ alignSelf: 'center' }}
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </div>
        )}
      </div>
    </div>
  );
}
