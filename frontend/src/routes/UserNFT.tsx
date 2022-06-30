import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { API_ADDRESS } from '../constants';
import NFTCard from '../components/NFTCard';
import type { NFT } from '../types';
import UserLoot from './UserLOOT';

const getUserNFT = async (userAddress: string | undefined) => {
  const res = await fetch(`${API_ADDRESS}/v1/nft/wallet/${userAddress}`);
  if (res.status === 404) return null;
  const NFTs = await res.json();

  return NFTs;
};

export default function UserNFT() {
  const params = useParams();
  const { userAddress } = params;
  const [userNFT, setUserNFT] = useState<Array<NFT> | null>(null);
  useEffect(() => {
    const wrapper = async () => {
      const result = await getUserNFT(userAddress);
      setUserNFT(result);
    };
    wrapper();
  }, []);

  // TODO doesnt handle 0 results (show infinite loading)
  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-5">Your Great Defenders</h2>
      {userNFT && userNFT.length > 0 && userAddress ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {userNFT.map((NFT: NFT) => (
            <NFTCard key={NFT.name} NFT={NFT} owner={userAddress} />
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
      <UserLoot />
    </div>
  );
}
