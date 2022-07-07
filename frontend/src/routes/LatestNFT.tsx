// *EXTERNALS*
import React, { useEffect, useState } from 'react';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import NFTCard from '../components/NFTCard';
import type { NFT } from '../types';

const getLatestNFT = async (nb: number) => {
  const res = await fetch(`${API_ADDRESS}/v1/nft/latest/${nb}`);
  if (res.status === 404) return null;
  const NFTs = await res.json();

  return NFTs;
};

export default function LatestNFT() {
  const [latestNFT, setLatestNFT] = useState<Array<NFT> | null>(null);
  useEffect(() => {
    const wrapper = async () => {
      const result = await getLatestNFT(3);
      setLatestNFT(result);
    };
    wrapper();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-5">Our Newly Born Defenders</h2>
      {latestNFT && latestNFT.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {latestNFT.map((NFT: NFT) => (
            // TODO owner 0x, could maybe fetch real owner
            <NFTCard key={NFT.name} NFT={NFT} owner="0x" />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h1>Whoops, looks like no defender has been minted yet</h1>
        </div>
      )}
    </div>
  );
}
