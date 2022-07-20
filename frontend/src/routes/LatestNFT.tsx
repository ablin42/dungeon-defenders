// *EXTERNALS*
import React from 'react';
import { useEthers } from '@usedapp/core';
import useSWR from 'swr';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import type { NFT } from '../types';
import Mint from '../components/Actions/Mint';
import ConnectWallet from '../components/Actions/ConnectWallet';
import CardWrapper from '../components/CardWrapper';

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function LatestNFT() {
  const { account } = useEthers();
  const { data: latestNFT, error } = useSWR(`${API_ADDRESS}/v1/nft/latest/3`, fetcher);

  return (
    <>
      {latestNFT && latestNFT.length > 0 ? (
        <>
          <h2 className="text-start mb-2">Newly Born Defenders</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {latestNFT.map((NFT: NFT) => (
              <CardWrapper key={NFT.name} NFT={NFT} owner={NFT.owner || '0x'} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-5 mb-5">
          <h1>Whoops, looks like no defender has been minted yet</h1>
          <h4>Be the first to mint a Defender</h4>
          <div className="col-4 offset-4">{account ? <Mint userAddress={account} /> : <ConnectWallet />}</div>
        </div>
      )}
    </>
  );
}
