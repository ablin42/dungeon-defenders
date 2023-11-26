// *EXTERNALS*
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import { useGemsBalance, useStakes } from '../../hooks/index';
import { getExpiration } from '../../utils';
import Play from '../Actions/Play';
import { NFT } from '../../types';
import Rewards from '../Rewards';

interface StakeSectionProps {
  NFT: NFT;
  account: string;
  slots: Array<number>;
}

export default function StakeSection({ NFT, slots, account }: StakeSectionProps) {
  const gemsBalance = useGemsBalance(account) || 0;
  const [gemsAmount, setGemsAmount] = useState<number>(100);
  const stakes = useStakes(account);
  const { expired } = getExpiration(stakes);
  const claimable = stakes && stakes.isClaimable;

  return (
    <div className="col-12 mt-4 h-auto">
      <div className="text-start staking-section h-100">
        <div>
          {!expired && !claimable ? (
            <>
              <div className="alert alert-info w-100">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                  <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </symbol>
                  <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                  </symbol>
                  <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </symbol>
                </svg>
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
                  <use xlinkHref="#info-fill" />
                </svg>
                Staking more <FontAwesomeIcon className="fa-icon fa-main" icon={faGem} fontSize={18} /> increases{' '}
                <b>difficulty</b> & <b>rewards</b>
              </div>

              <label htmlFor="customRange1" className="form-label">
                <span className="lead">
                  Staking <b className="text-main">{gemsAmount}</b>{' '}
                </span>
                <FontAwesomeIcon className="fa-icon fa-main" icon={faGem} fontSize={20} />
              </label>
              <input
                type="range"
                className="w-100 mb-2"
                id="customRange1"
                step="10"
                min="100"
                max={+gemsBalance < 1000 ? gemsBalance : 1000}
                onChange={(e) => setGemsAmount(+e.target.value)}
                value={gemsAmount}
              />
            </>
          ) : (
            <Rewards />
          )}
        </div>

        <Play userAddress={account} tokenId={NFT.tokenId} equipedLoot={slots} gemsAmount={gemsAmount} />
      </div>
    </div>
  );
}