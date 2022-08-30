// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import type { NFT } from '../types';
import LoadWith404 from '../components/Misc/LoadWith404';
import CardWrapper from '../components/Card/CardWrapper';

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function UserLoot() {
  const params = useParams();
  const { userAddress } = params;
  const { data: userLOOT } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${userAddress}`, fetcher);

  return (
    <>
      <h2 className="mt-5 mb-2">Loot</h2>
      {userLOOT?.length > 0 && userAddress ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {userLOOT.map((NFT: NFT) => (
            <CardWrapper key={NFT.name} NFT={NFT} isLoot />
          ))}
        </div>
      ) : (
        <LoadWith404 title="User has no Loot yet" error="" btnText="" isLoading={!userLOOT} />
      )}
    </>
  );
}
