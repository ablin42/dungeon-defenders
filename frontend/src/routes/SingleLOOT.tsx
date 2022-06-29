import React from 'react';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

import NFTCard from '../components/NFTCard';
import { useOwnerOfLoot, useTokenURILoot } from '../hooks/index';

export default function SingleLOOT() {
  const params = useParams();
  const { lootId } = params;
  const URI = useTokenURILoot(lootId || 0);
  const owner = useOwnerOfLoot(lootId || 0);
  const LOOTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (LOOTObject) LOOTObject.tokenId = lootId;

  // TODO doesnt handle 0 results (show infinite loading)
  return (
    <div className="text-center mt-5 mb-5">
      <h2 className="mb-2">Hrmm.. Juicy loot</h2>
      <div className="container col-4">
        {URI ? (
          <NFTCard NFT={LOOTObject} owner={owner} isLoot />
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
