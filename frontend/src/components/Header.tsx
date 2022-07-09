// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import styled from 'styled-components';

// *INTERNALS*
import ConnectWallet from './Actions/ConnectWallet';
import { useGemsBalance, useStakes } from '../hooks';
import Button from './Button';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  const { account } = useEthers();
  const gemsBalance = useGemsBalance(account) || 0;
  const stakes = useStakes(account && account);

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
                {stakes?.isInitialized && !stakes.isClaimable && (
                  <Link to={`/Play`} className="me-3">
                    <button className="btn btn-info">Game in progress</button>
                  </Link>
                )}
                {stakes?.isClaimable && (
                  <Link to={`/Play`} className="me-3">
                    <button className="btn btn-info">Claim pending 🎉</button>
                  </Link>
                )}
                <Link to={`/NFT/user/${account}`} className="me-3">
                  <button className="btn btn-success">Your Collection</button>
                </Link>
              </>
            )}
            <ConnectWallet />
            <Link to={`/About`} className="ms-3">
              <Button width="75px" size="sm" btnType="outline-primary">
                About
              </Button>
            </Link>
          </Wrapper>
        </div>
      </div>
    </header>
  );
};

export default Header;
