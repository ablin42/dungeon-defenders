import React from 'react';
import { Link } from 'react-router-dom';
import ConnectWallet from './Actions/ConnectWallet';

const Header = () => {
  return (
    <header>
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <div>
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <strong>Dungeon Defenders</strong>
            </Link>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
