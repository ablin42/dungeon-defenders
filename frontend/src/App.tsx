import React from 'react';
import { Outlet } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import Header from './components/Header';
import Footer from './components/Footer';
import ConnectWallet from './components/ConnectWallet';
import Actions from './components/Actions';

const App = () => {
  const { account } = useEthers();
  return (
    <>
      <Header />

      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Welcome to Dungeon Defenders</h1>
            <p className="lead text-muted">Join our community by minting your first NFT</p>
            <div>
              {account ? (
                <>
                  {account}
                  <br />
                  <br />
                  <Actions />
                  {/* <MintNFT userAddress={account} />
                  <TransferNFT userAddress={account} /> */}
                </>
              ) : (
                <ConnectWallet />
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="album py-4 bg-dark">
        <div className="container">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
