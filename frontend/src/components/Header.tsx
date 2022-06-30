// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import styled from 'styled-components';

// *INTERNALS*
import ConnectWallet from './Actions/ConnectWallet';
import { useGemsBalance } from '../hooks';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  const { account } = useEthers();
  const gemsBalance = useGemsBalance(account) || 0;

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
              <>
                <Wrapper className="me-3">
                  <b>{+gemsBalance} Gems</b>
                </Wrapper>
                <Link to={`/NFT/user/${account}`} className="me-3">
                  <button className="btn btn-success">Your Collection</button>
                </Link>
              </>
            )}
            <ConnectWallet />
          </Wrapper>
        </div>
      </div>
    </header>
  );
};

export default Header;
