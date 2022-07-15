// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

// *INTERNALS*
import NFTCard from '../components/NFTCard';
import { useOwnerOfLoot, useTokenURILoot } from '../hooks/index';
import LoadWith404 from '../components/LoadWith404';

export default function SingleLOOT() {
  const params = useParams();
  const { lootId } = params;
  const [isLoading, setIsLoading] = useState(true);
  const URI = useTokenURILoot(lootId || 0);
  const owner = useOwnerOfLoot(lootId || 0);
  const LOOTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (LOOTObject) LOOTObject.tokenId = lootId;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000 * 5);
  }, []);

  return (
    <div className="text-center mt-4 mb-5">
      <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
        <div className="col-8 offset-2">
          {URI ? <NFTCard NFT={LOOTObject} owner={owner} isLoot /> : <LoadWith404 isLoading={isLoading} />}
        </div>
      </div>
    </div>
  );
}
