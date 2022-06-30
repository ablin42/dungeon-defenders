import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { API_ADDRESS } from '../constants';
import NFTCard from '../components/NFTCard';
import type { NFT } from '../types';

const getUserLOOT = async (userAddress: string | undefined) => {
  const res = await fetch(`${API_ADDRESS}/v1/loot/wallet/${userAddress}`);
  if (res.status === 404) return null;
  const NFTs = await res.json();

  return NFTs;
};

export default function UserLoot() {
  const params = useParams();
  const { userAddress } = params;
  const [userLOOT, setUserLOOT] = useState<Array<NFT> | null>(null);
  useEffect(() => {
    const wrapper = async () => {
      const result = await getUserLOOT(userAddress);
      setUserLOOT(result);
    };
    wrapper();
  }, []);

  // TODO doesnt handle 0 results (show infinite loading)
  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-5">Your Awesome Loot</h2>
      {userLOOT && userLOOT.length > 0 && userAddress ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {userLOOT.map((NFT: NFT) => (
            <NFTCard key={NFT.name} NFT={NFT} owner={userAddress} isLoot />
          ))}
        </div>
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
  );
}