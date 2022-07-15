// *EXTERNALS*
import React from 'react';
import { useEthers } from '@usedapp/core';

// *INTERNALS*
import Mint from '../components/Actions/Mint';
import Faucet from '../components/Actions/Faucet';
import ConnectWallet from '../components/Actions/ConnectWallet';
import LatestNFT from './LatestNFT';

const Home = () => {
  const { account } = useEthers();
  return (
    <>
      <div className="container">
        <div className="text-center mt-5 mb-5">
          <h1 className="fw-light">Start playing right now</h1>
          {account ? (
            <>
              <div className="col-lg-6 col-md-8 mx-auto">
                <div className="col-8 offset-2" id="faucet">
                  <p className="lead text-muted mb-0 text-start">1. Claim some Gems from the Faucet</p>
                  <Faucet userAddress={account} />
                </div>
              </div>

              <div className="mt-3" />

              <div className="col-lg-6 col-md-8 mx-auto">
                <div className="col-8 offset-2" id="mint">
                  <p className="lead text-muted mb-0 text-start">2. Mint your first Defender</p>
                  <Mint userAddress={account} />
                </div>
              </div>
            </>
          ) : (
            <div className="col-lg-6 col-md-8 mx-auto">
              <div className="col-8 offset-2" id="mint">
                <p className="lead text-muted mb-1 text-center">Please connect your wallet</p>
                <ConnectWallet />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="album bg-dark">
        <div className="container pt-5 pb-5">
          <div className="container-decorated">
            <LatestNFT />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
