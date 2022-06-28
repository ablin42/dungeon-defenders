import React, { useEffect, useState } from 'react';

import { API_ADDRESS } from '../constants';
import NFTCard from '../components/NFTCard';
import NotFound from '../components/NotFound';
import type { NFT } from '../types';

const getAllNFT = async () => {
  const res = await fetch(`${API_ADDRESS}/v1/nft`);
  if (res.status === 404) return null;
  const { NFTs } = await res.json();

  return NFTs;
};

export default function AllNFT() {
  const [allNFT, setAllNFT] = useState<Array<NFT> | null>(null);
  useEffect(() => {
    const wrapper = async () => {
      const result = await getAllNFT();
      setAllNFT(result);
    };
    wrapper();
  }, []);

  return allNFT ? (
    <>
      <h2 className="text-center mt-5 mb-5">Our Great Defenders</h2>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {allNFT.map((NFT: NFT) => (
          <NFTCard key={NFT.tokenId} NFT={NFT} />
        ))}
      </div>
    </>
  ) : (
    <NotFound />
  );
}
