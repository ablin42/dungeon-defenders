import React from 'react';
import { useEthers } from '@usedapp/core';
import Mint from '../components/Actions/Mint';
import Loot from '../components/Actions/MintLoot';
import LatestNFT from './LatestNFT';

const App = () => {
  const { account } = useEthers();
  return (
    <div className="text-center mt-5 mb-5">
      <h1 className="fw-light">Welcome to Dungeon Defenders</h1>
      <p className="lead text-muted">Join our community by minting your first NFT</p>
      <div className="container">
        <div className="col-lg-6 col-md-8 mx-auto">{account && <Mint userAddress={account} />}</div>
        <div className="col-lg-6 col-md-8 mx-auto">{account && <Loot userAddress={account} />}</div>
      </div>
      <div className="album bg-dark">
        <div className="container ">
          <div className="col-lg-12 mx-auto">
            <div className="pt-1 pb-5 m-5">
              <LatestNFT />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
