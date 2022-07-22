// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import { Buffer } from 'buffer';

// *INTERNALS*
import { useTokenURILoot } from '../hooks/index';
import CardWrapper from '../components/Card/CardWrapper';

export default function SingleLOOT() {
  const params = useParams();
  const { lootId } = params;
  const URI = useTokenURILoot(lootId || 0);
  const LOOTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (LOOTObject) LOOTObject.tokenId = lootId;

  return (
    <div className="text-center mt-5">
      <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
        <div className="col-8 offset-2">{LOOTObject && <CardWrapper NFT={LOOTObject} isLoot />}</div>
      </div>
    </div>
  );
}
