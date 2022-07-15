// *EXTERNALS*
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { TransactionState, TransactionStatus } from '@usedapp/core';
import { Link, useNavigate } from 'react-router-dom';
import { STAKE_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import {
  useStake,
  useApprove,
  useAllowance,
  useAllowanceGEMS,
  useIsStaked,
  useApproveGEMS,
  useStakes,
} from '../../hooks/index';
import { STATUS_TYPES, GEMS_TOTAL_SUPPLY } from '../../constants';
import LoadingBtn from '../LoadingBtn';
import { sendTx, handleTxStatus } from '../../utils';

type ActionProps = {
  userAddress: string;
  tokenId: number | string;
  equipedLoot: Array<number>;
};

type FormProps = {
  value: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  children: React.ReactNode;
};

const STATE_INDEX = {
  APPROVENFT: 0,
  APPROVEGEMS: 1,
  STAKE: 2,
};

const FormUtil = ({ value, onChange, children }: FormProps) => {
  return (
    <div className="form-group text-start ms-1 me-1">
      <label htmlFor="gemsAmount">
        Amount (min. 100 <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} />)
      </label>
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          placeholder="100"
          min={100}
          aria-label="Gems Amount"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
        {children}
      </div>
    </div>
  );
};

const Play: React.FC<ActionProps> = ({ userAddress, tokenId, equipedLoot }) => {
  // *HOOKS*
  const navigate = useNavigate();
  const { state: approveNFTState, send: sendApproveNFT } = useApprove();
  const { state: approveGEMSState, send: sendApproveGEMS } = useApproveGEMS();
  const { state: stakeState, send: sendStake } = useStake();
  const stakes = userAddress && useStakes(userAddress);
  const NFTallowance = useAllowance(userAddress);
  const GEMSallowance = useAllowanceGEMS(userAddress, STAKE_CONTRACT_ADDRESS);
  const staked = useIsStaked(userAddress);
  const stakedId = stakes && +stakes.tokenId;
  const claimable = staked && stakes && stakes.isClaimable;
  // *STATE*
  const [gemsAmount, setGemsAmount] = useState('100');
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([approveNFTState, approveGEMSState, stakeState]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([approveNFTState, approveGEMSState, stakeState]);
  }, [approveNFTState, approveGEMSState, stakeState]);

  useEffect(() => {
    const successHandler = (index: number) => {
      if (index === 2) {
        setTimeout(async () => {
          navigate(`/Play`, {
            replace: false,
            state: {
              owner: userAddress,
              defenderId: tokenId,
              weaponId: equipedLoot[0],
              armorId: equipedLoot[1],
              bootsId: equipedLoot[2],
              gemsAmount,
            },
          });
        }, 5000);
      }
    };

    handleTxStatus(STATES, STATUS, handleStateChange, successHandler);
  }, [STATES]);

  const approveNFT = async () => {
    sendApproveNFT(STAKE_CONTRACT_ADDRESS, true);
  };
  const approveGEMS = async () => {
    sendApproveGEMS(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };
  const stake = async () => {
    const formattedGemsAmount = ethers.utils.parseEther(gemsAmount);
    sendStake(tokenId, equipedLoot[0], equipedLoot[1], equipedLoot[2], formattedGemsAmount);
  };

  if (isPending[STATE_INDEX.APPROVENFT] || isPending[STATE_INDEX.APPROVEGEMS])
    return <LoadingBtn type="primary" width="100%" />;
  // To handle loading state with no button (loading up the page for the 1st time)
  if (NFTallowance === undefined && GEMSallowance === undefined && staked === undefined)
    return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;

  return (
    <>
      {!NFTallowance && (
        <button onClick={() => sendTx(approveNFT)} className="btn btn-lg btn-primary w-100">
          Approve DEFENDERS
        </button>
      )}
      {!GEMSallowance && NFTallowance && (
        <button onClick={() => sendTx(approveGEMS)} className="btn btn-lg btn-primary w-100">
          Approve <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} />
        </button>
      )}
      {NFTallowance && GEMSallowance && !staked ? (
        isPending[STATE_INDEX.STAKE] ? (
          <FormUtil value={gemsAmount} onChange={setGemsAmount}>
            <LoadingBtn type="primary" width="175px" />
          </FormUtil>
        ) : (
          <FormUtil value={gemsAmount} onChange={setGemsAmount}>
            <button onClick={() => sendTx(stake)} className="btn btn-lg btn-primary">
              Stake &amp; Play
            </button>
          </FormUtil>
        )
      ) : null}
      {NFTallowance && GEMSallowance && staked && tokenId == stakedId ? (
        <>
          <Link to={`/Play`}>
            <button className="btn btn-lg btn-info w-100">
              {claimable ? (
                'Claim pending 🎉'
              ) : (
                <>
                  {'Game in progress '}
                  <div className="ms-2 spinner-border spinner-border-sm text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              )}
            </button>
          </Link>
        </>
      ) : null}
    </>
  );
};

export default Play;
