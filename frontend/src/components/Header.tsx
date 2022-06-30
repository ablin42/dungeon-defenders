import React from 'react';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';

import ConnectWallet from './Actions/ConnectWallet';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
`;

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
          <Wrapper>
            {account && (
              <Link to={`/NFT/user/${account}`} className="me-3">
                <button className="btn btn-success">Play</button>
              </Link>
            )}
            <ConnectWallet />
          </Wrapper>
        </div>
      </div>
    </header>
  );
};

export default Header;
