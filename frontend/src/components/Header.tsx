// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox, faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import ConnectWallet from './Actions/ConnectWallet';
import { useGemsBalance, useStakes } from '../hooks';
import Button from './Misc/Button';

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
                  <b>
                    {+gemsBalance} <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} />
                  </b>
                </Wrapper>
                {stakes?.isInitialized && !stakes.isClaimable && (
                  <Link to={`/Play`} className="me-3">
                    <button className="btn btn-info w-100 align-items-center">
                      Game in progress
                      <div className="ms-2 spinner-border spinner-border-sm text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </button>
                  </Link>
                )}
                {stakes?.isClaimable && (
                  <Link to={`/Play`} className="me-3">
                    <button className="btn btn-info">Claim pending 🎉</button>
                  </Link>
                )}
              </>
            )}
            <div className="btn-group" role="group" aria-label="Basic example">
              <ConnectWallet />
              {account && (
                <Link to={`/Collection/${account}`} className="btn btn-primary w-25" role="button">
                  <FontAwesomeIcon className="fa-icon fa-white" icon={faToolbox} fontSize={20} />
                </Link>
              )}
            </div>
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
