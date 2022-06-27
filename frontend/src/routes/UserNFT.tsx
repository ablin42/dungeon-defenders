import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { API_ADDRESS } from '../constants';
import NFTCard from '../components/NFTCard';
import NotFound from '../components/NotFound';
import type { NFT } from '../types';

const getUserNFT = async (userAddress: string | undefined) => {
  const res = await fetch(`${API_ADDRESS}/v1/nft/user/${userAddress}`);
  if (res.status === 404) return null;
  const { NFTs } = await res.json();

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

  return userNFT ? (
    <>
      <h2 className="text-center mt-5 mb-5">Your Great Defenders</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {userNFT.map((NFT: NFT) => (
          <NFTCard key={NFT.tokenId} NFT={NFT} />
        ))}
      </div>
    </>
  ) : (
    <NotFound />
  );
}
