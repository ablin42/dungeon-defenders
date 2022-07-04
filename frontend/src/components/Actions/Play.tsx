// *EXTERNALS*
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { TransactionState, TransactionStatus } from '@usedapp/core';
import { useNavigate } from 'react-router-dom';
import { STAKE_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';

// *INTERNALS*
import {
  useStake,
  useUnstake,
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
  UNSTAKE: 3,
};

const FormUtil = ({ value, onChange, children }: FormProps) => {
  return (
    <div className="form-group text-start ms-1 me-1">
      <label htmlFor="gemsAmount">Gems Amount (min. 100)</label>
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
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const stakes = userAddress && useStakes(userAddress);
  const NFTallowance = useAllowance(userAddress);
  const GEMSallowance = useAllowanceGEMS(userAddress, STAKE_CONTRACT_ADDRESS);
  const staked = useIsStaked(userAddress);
  const stakedId = stakes && +stakes.tokenId;
  const claimable = staked && stakes && stakes.isClaimable;
  // *STATE*
  const [gemsAmount, setGemsAmount] = useState('100');
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([
    approveNFTState,
    approveGEMSState,
    stakeState,
    unstakeState,
  ]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([approveNFTState, approveGEMSState, stakeState, unstakeState]);
  }, [approveNFTState, approveGEMSState, stakeState, unstakeState]);

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
  const unstake = async () => {
    sendUnstake();
  };

  if (isPending[STATE_INDEX.APPROVENFT] || isPending[STATE_INDEX.APPROVEGEMS] || isPending[STATE_INDEX.UNSTAKE])
    return <LoadingBtn type="success" width="100%" />;
  // To handle loading state with no button (loading up the page for the 1st time)
  if (NFTallowance === undefined && GEMSallowance === undefined && staked === undefined)
    return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;

  return (
    <>
      {!NFTallowance && (
        <button onClick={() => sendTx(approveNFT)} className="btn btn-lg btn-success w-100">
          Approve NFTs
        </button>
      )}
      {!GEMSallowance && NFTallowance && (
        <button onClick={() => sendTx(approveGEMS)} className="btn btn-lg btn-success w-100">
          Approve GEMS
        </button>
      )}
      {NFTallowance && GEMSallowance && !staked ? (
        isPending[STATE_INDEX.STAKE] ? (
          <FormUtil value={gemsAmount} onChange={setGemsAmount}>
            <LoadingBtn type="success" />
          </FormUtil>
        ) : (
          <FormUtil value={gemsAmount} onChange={setGemsAmount}>
            <button onClick={() => sendTx(stake)} className="btn btn-lg btn-success">
              Stake &amp; Play
            </button>
          </FormUtil>
        )
      ) : null}
      {NFTallowance && GEMSallowance && staked && tokenId == stakedId ? (
        <>
          {!claimable ? (
            <>
              <span className="muted-text">Game not finished yet</span>
              <br />
            </>
          ) : (
            <ul className="list-group text-start">
              <li className="list-group-item">
                <b>Rewarded Exp - {stakes.rewardedExpAmount.toNumber()}</b>
              </li>
              <li className="list-group-item">
                <b>Rewarded Gems - {ethers.utils.formatEther(stakes.rewardedGemsAmount)}</b>
              </li>
              <li className="list-group-item">
                <b>Loot Reward - {stakes.wasRewardLoot ? '✅' : '❌'}</b>
              </li>
            </ul>
          )}
          <button onClick={() => sendTx(unstake)} className="btn btn-lg btn-success w-100" disabled={!claimable}>
            Claim
          </button>
        </>
      ) : null}
    </>
  );
};

export default Play;
