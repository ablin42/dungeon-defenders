// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

// *INTERNALS*
import { useTokenURI, useOwnerOf } from '../hooks/index';
import CardWrapper from '../components/Card/CardWrapper';

export default function SingleNFT() {
  const params = useParams();
  const { nftId } = params;
  const URI = useTokenURI(nftId || 0);
  const owner = useOwnerOf(nftId || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;

  return (
    <div className="text-center mt-4 mb-5">
      <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
        <div className="col-8 offset-2">{NFTObject && <CardWrapper NFT={NFTObject} owner={owner} />}</div>
      </div>
    </div>
  );
}
