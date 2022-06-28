import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import {
  useStake,
  useUnstake,
  useApprove,
  useAllowance,
  useAllowanceGEMS,
  useIsStaked,
  useApproveGEMS,
} from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS, STATUS_TYPES, GEMS_TOTAL_SUPPLY, NETWORK_EXPLORER } from '../../constants';
import toast from 'react-hot-toast';
import { TransactionStatus } from '@usedapp/core';

type ActionProps = {
  userAddress: string;
};

const Play: React.FC<ActionProps> = ({ userAddress }) => {
  const [isPending, setIsPending] = useState(false);
  const [tokenId, setTokenid] = useState(0);
  const [gemsAmount, setGemsAmount] = useState('100');
  const { state: approveNFTState, send: sendApproveNFT } = useApprove();
  const { state: approveGEMSState, send: sendApproveGEMS } = useApproveGEMS();
  const { state: stakeState, send: sendStake } = useStake();
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const [STATUS, setSTATUS] = useState<Array<string>>([
    approveNFTState.status,
    approveGEMSState.status,
    stakeState.status,
    unstakeState.status,
  ]);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([
    approveNFTState,
    approveGEMSState,
    stakeState,
    unstakeState,
  ]);
  const NFTallowance = useAllowance(userAddress);
  const GEMSallowance = useAllowanceGEMS(userAddress);
  const staked = useIsStaked(userAddress);

  useEffect(() => {
    const newSTATES = [approveNFTState, approveGEMSState, stakeState, unstakeState];
    const newSTATUS = [approveNFTState.status, approveGEMSState.status, stakeState.status, unstakeState.status];
    setSTATUS(newSTATUS);
    setSTATES(newSTATES);
  }, [approveNFTState, approveGEMSState, stakeState, unstakeState]);

  useEffect(() => {
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const targetedState = STATES[successIndex];
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[successIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);

      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
            {targetedState.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
        {
          icon: '✅',
          position: 'top-right',
        },
      );
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[statusIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);

      toast.error(`Tx Error`, {
        icon: '❌',
        position: 'top-right',
      });
    }
  }, [STATUS]);

  // Could create an handler function to avoid repetitiveness, but there are other priorities
  const approveNFT = async () => {
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    sendApproveNFT(STAKE_CONTRACT_ADDRESS, true);
  };

  const approveGEMS = async () => {
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    sendApproveGEMS(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };

  const stake = async () => {
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    const formattedGemsAmount = ethers.utils.parseEther(gemsAmount);
    sendStake(tokenId, formattedGemsAmount);
  };

  const unstake = async () => {
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    sendUnstake();
  };

  if (isPending) {
    return (
      <button className="btn btn-lg btn-success">
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span className="sr-only">Tx Pending...</span>
      </button>
    );
  }

  return (
    <>
      {!NFTallowance && (
        <button onClick={() => approveNFT()} className="btn btn-lg btn-success">
          Approve NFTs
        </button>
      )}
      {!GEMSallowance && NFTallowance && (
        <button onClick={() => approveGEMS()} className="btn btn-lg btn-success">
          Approve GEMS
        </button>
      )}
      {NFTallowance && GEMSallowance && !staked ? (
        <>
          <div className="form-group text-start">
            <label htmlFor="gemsAmount">Gems Amount (min. 100)</label>
            <input
              type="number"
              className="form-control"
              placeholder="100"
              min={100}
              aria-label="Gems Amount"
              onChange={(e) => setGemsAmount(e.target.value)}
              value={gemsAmount}
            />

            {/* 
              Later on, you'll see your NFT & select them instead of inputing their ID
              This is currently the case in NFTCardAlternative, remove the tokenId input later
            */}
            <label htmlFor="tokenId">Token ID</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                placeholder="1337"
                aria-label="Token #ID"
                onChange={(e) => setTokenid(parseInt(e.target.value))}
                value={tokenId}
              />

              <button onClick={() => stake()} className="btn btn-lg btn-success">
                Stake & Play
              </button>
            </div>
          </div>
        </>
      ) : null}
      {NFTallowance && GEMSallowance && staked ? (
        <button onClick={() => unstake()} className="btn btn-lg btn-success">
          Claim
        </button>
      ) : null}
    </>
  );
};

export default Play;
