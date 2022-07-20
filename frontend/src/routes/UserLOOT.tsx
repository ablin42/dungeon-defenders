// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import type { NFT } from '../types';
import LoadWith404 from '../components/LoadWith404';
import CardWrapper from '../components/CardWrapper';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const wrapper = async () => {
      const result = await getUserLOOT(userAddress);
      setUserLOOT(result);
      setIsLoading(false);
    };
    wrapper();
  }, []);

  return (
    <>
      <h2 className="mt-5 mb-2">Collection</h2>
      {userLOOT && userLOOT.length > 0 && userAddress ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {userLOOT.map((NFT: NFT) => (
            <CardWrapper key={NFT.name} NFT={NFT} owner={userAddress} isLoot />
          ))}
        </div>
      ) : (
        <LoadWith404 title="User has no Loot yet" error="" btnText="" isLoading={isLoading} />
      )}
    </>
  );
}
