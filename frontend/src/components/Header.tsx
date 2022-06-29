import React from 'react';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';

import ConnectWallet from './Actions/ConnectWallet';

const Header = () => {
  const { account } = useEthers();

  return (
    <header>
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <div>
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <strong>Dungeon Defenders</strong>
            </Link>
          </div>
          <div>
            <Link to={`/NFT/user/${account}`} className="d-flex align-items-center">
              <strong>My Defenders</strong>
            </Link>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
