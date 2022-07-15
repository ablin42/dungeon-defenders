// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

// *INTERNALS*
import NFTCard from '../components/NFTCard';
import { useTokenURI, useOwnerOf } from '../hooks/index';
import LoadWith404 from '../components/LoadWith404';

export default function SingleNFT() {
  const params = useParams();
  const { nftId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const URI = useTokenURI(nftId || 0);
  const owner = useOwnerOf(nftId || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000 * 5);
  }, []);

  return (
    <div className="text-center mt-4 mb-5">
      <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
        <div className="col-8 offset-2">
          {URI ? <NFTCard NFT={NFTObject} owner={owner} /> : <LoadWith404 isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
}
