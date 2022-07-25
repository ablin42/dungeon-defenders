// *EXTERNALS*
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import { useStakes } from '../hooks';

export default function Rewards() {
  const { account } = useEthers();
  const stakes = useStakes(account);

  return (
    <>
      <h1 className="mb-2 text-center">Claim your rewards 🎉</h1>
      <ul className="list-group list-reward text-start">
        <li className="list-group-item">
          <span>Rewarded XP</span>
          <b>
            {stakes && stakes.rewardedExpAmount.toNumber() >= 0 ? (
              stakes.rewardedExpAmount.toNumber()
            ) : (
              <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </b>
        </li>
        <li className="list-group-item ms-2 me-2">
          <span>Rewarded Gems</span>
          <b>
            {(stakes && (
              <>
                {+ethers.utils.formatEther(stakes.rewardedGemsAmount)}{' '}
                <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} />
              </>
            )) || (
              <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </b>
        </li>
        <li className="list-group-item">
          <span>Found Loot</span>
          <b>
            {(stakes && stakes.wasRewardLoot ? '✅' : '❌') || (
              <div className="ms-2 spinner-border spinner-border-sm text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </b>
        </li>
      </ul>
    </>
  );
}
