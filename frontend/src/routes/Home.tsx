import React from 'react';
import { useEthers } from '@usedapp/core';
import Actions from '../components/Actions/Actions';
import Mint from '../components/Actions/Mint';

const App = () => {
  const { account } = useEthers();
  return (
    <div className="text-center mt-5 mb-5">
      <h1 className="fw-light">Welcome to Dungeon Defenders</h1>
      <p className="lead text-muted">Join our community by minting your first NFT</p>
      <div className="container">
        <div className="col-lg-6 col-md-8 mx-auto">
          <Mint userAddress={account as string} />
        </div>
      </div>
      <div className="album bg-dark">
        <div className="container ">
          <div className="col-lg-6 col-md-8 mx-auto">
            <div>{account && <Actions userAddress={account} />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
