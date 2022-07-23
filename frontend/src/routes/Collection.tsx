// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEthers } from '@usedapp/core';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import type { NFT } from '../types';
import UserLoot from './UserLOOT';
import LoadWith404 from '../components/Misc/LoadWith404';
import CardWrapper from '../components/Card/CardWrapper';
import Prepare from '../components/Play/Prepare';

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function Collection() {
  /* HOOKS */
  const params = useParams();
  const { userAddress } = params;
  const { account } = useEthers();
  const { data: userNFT } = useSWR(`${API_ADDRESS}/v1/nft/wallet/${userAddress}`, fetcher);
  /* STATE */
  const [selectedNFT, setSelectedNFT] = useState<any>(userNFT?.[0] || null);

  useEffect(() => {
    handleSelection(userNFT?.[0]);
  }, [userNFT]);

  const handleSelection = (NFT: NFT) => {
    if (!NFT) return null;
    const newSelection = { ...NFT };
    newSelection.tokenId = +newSelection.name.substring(10);
    setSelectedNFT(newSelection);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, NFT: NFT) => {
    e.stopPropagation();
    handleSelection(NFT);
  };

  return (
    <div className="container">
      {userAddress === account && selectedNFT && (
        // TODO lazy fix, prepare prob shouldnt have a container itself
        <div style={{ margin: '-12px' }}>
          <Prepare account={account || ''} NFT={selectedNFT} />
        </div>
      )}

      <div className="container-decorated mt-5">
        <h2 className="mb-2">Defenders</h2>
        {userNFT && userNFT.length > 0 && userAddress ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {userNFT.map((NFT: NFT) => (
              <CardWrapper key={NFT.name} NFT={NFT} onClick={(e) => handleClick(e, NFT)} />
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
