import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NFTCard from '../components/NFTCard';
import TakeMeHome from '../components/TakeMeHome';
import NotFound from '../components/NotFound';
import { API_ADDRESS } from '../constants';
import type { NFT } from '../types';

const getNFT = async (nftId: string | undefined) => {
  const res = await fetch(`${API_ADDRESS}/v1/nft/${nftId}`);
  if (res.status === 404) return null;
  const nftData = await res.json();

  return nftData;
};

export default function SingleNFT() {
  const params = useParams();
  const { nftId } = params;
  const [NFT, setNFT] = useState<NFT | null>(null);

  useEffect(() => {
    const wrapper = async () => {
      const result = await getNFT(nftId);
      setNFT(result);
    };
    wrapper();
  }, [nftId]);

  return NFT ? (
    <div className="text-center mt-5 mb-5">
      {/* <TakeMeHome /> or <Play /> */}
      <h2 className="mb-2">Oh, Great Defender !</h2>
      <div className="container col-4">
        <NFTCard NFT={NFT} />
      </div>
    </div>
  ) : (
    <NotFound />
  );
}
