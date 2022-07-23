// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import type { NFT } from '../types';
import UserLoot from './UserLOOT';
import LoadWith404 from '../components/Misc/LoadWith404';
import CardWrapper from '../components/Card/CardWrapper';

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function UserNFT() {
  const params = useParams();
  const { userAddress } = params;
  const { data: userNFT, error } = useSWR(`${API_ADDRESS}/v1/nft/wallet/${userAddress}`, fetcher);

  return (
    <div className="container">
      <div className="container-decorated mt-5">
        <h2 className="mb-2">Defenders</h2>
        {userNFT && userNFT.length > 0 && userAddress ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {userNFT.map((NFT: NFT) => (
              <CardWrapper key={NFT.name} NFT={NFT} />
            ))}
          </div>
        ) : (
          <LoadWith404 title="User has no Defender yet" error="" btnText="Mint One Here" isLoading={!userNFT} />
        )}
        <UserLoot />
      </div>
    </div>
  );
}
