import React from 'react';
import { useParams } from 'react-router-dom';

import NFTCardAlternative from '../components/NFTCardAlternative';
import NotFound from '../components/NotFound';
import { useTokenURI } from '../hooks/index';
import { Buffer } from 'buffer';

export default function SingleNFT() {
  const params = useParams();
  const { nftId } = params;
  const URI = useTokenURI(nftId || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;

  return URI ? (
    <div className="text-center mt-5 mb-5">
      <h2 className="mb-2">Oh, Great Defender !</h2>
      <div className="container col-4">
        <NFTCardAlternative NFT={NFTObject} />
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
