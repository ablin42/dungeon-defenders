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
import { STAKE_CONTRACT_ADDRESS, STATUS_TYPES, GEMS_TOTAL_SUPPLY } from '../../constants';

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
  const NFTallowance = useAllowance(userAddress);
  const GEMSallowance = useAllowanceGEMS(userAddress);
  const staked = useIsStaked(userAddress);

  useEffect(() => {
    const newSTATUS = [approveNFTState.status, approveGEMSState.status, stakeState.status, unstakeState.status];
    setSTATUS(newSTATUS);
  }, [approveNFTState, approveGEMSState, stakeState, unstakeState]);

  useEffect(() => {
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[successIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      setIsPending(false);
    }
  }, [STATUS]);

  const approveNFT = async () => {
    sendApproveNFT(STAKE_CONTRACT_ADDRESS, true);
  };

  const approveGEMS = async () => {
    sendApproveGEMS(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };

  const stake = async () => {
    const formattedGemsAmount = ethers.utils.parseEther(gemsAmount);
    sendStake(tokenId, formattedGemsAmount);
  };

  const unstake = async () => {
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
