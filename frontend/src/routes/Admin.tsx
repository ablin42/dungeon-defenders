// *EXTERNALS*
import React from 'react';
import { useEthers } from '@usedapp/core';

// *INTERNALS*
import Mint from '../components/Actions/Mint';
import Loot from '../components/Actions/MintLoot';
import Faucet from '../components/Actions/Faucet';

const Admin = () => {
  const { account } = useEthers();
  return (
    <div className="text-center mt-5 mb-5">
      <h1 className="fw-light">ADMIN DASHBOARD</h1>
      <div className="container">
        {account && (
          <>
            <div className="col-lg-6 col-md-8 mx-auto">
              <div className="col-8 offset-2" id="mint">
                <Mint userAddress={account} />
              </div>
            </div>

            <div className="col-lg-6 col-md-8 mx-auto">
              <div className="col-8 offset-2" id="loot">
                <Loot userAddress={account} />
              </div>
            </div>

            <div className="col-lg-6 col-md-8 mx-auto">
              <div className="col-8 offset-2" id="faucet">
                <Faucet userAddress={account} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
