import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useStake, useUnstake, useApprove, useAllowance, useIsStaked } from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS, STATUS_TYPES } from '../../constants';

type ActionProps = {
  userAddress: string;
};

const ApproveNFT: React.FC<ActionProps> = ({ userAddress }) => {
  const [isPending, setIsPending] = useState(false);
  const [tokenId, setTokenid] = useState(0);
  const { state: approveState, send: sendApprove } = useApprove();
  const { state: stakeState, send: sendStake } = useStake();
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const [STATUS, setSTATUS] = useState<Array<string>>([approveState.status, stakeState.status, unstakeState.status]);
  const allowance = useAllowance(userAddress);
  const staked = useIsStaked(userAddress);

  useEffect(() => {
    const newSTATUS = [approveState.status, stakeState.status, unstakeState.status];
    setSTATUS(newSTATUS);
  }, [approveState, stakeState, unstakeState]);

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

  const approve = async () => {
    sendApprove(STAKE_CONTRACT_ADDRESS, true);
  };

  const stake = async () => {
    const amount = ethers.utils.parseEther('1');
    sendStake(tokenId, amount);
  };

  const unstake = async () => {
    sendUnstake();
  };

  return (
    <>
      {isPending && (
        <button onClick={() => approve()} className="btn btn-lg btn-warning">
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span className="sr-only">Tx Pending...</span>
        </button>
      )}
      {!allowance && !isPending && (
        <button onClick={() => approve()} className="btn btn-lg btn-warning">
          Approve
        </button>
      )}
      {allowance && !staked && !isPending && (
        <>
          <input
            type="number"
            className="form-control"
            placeholder="1337"
            aria-label="Token #ID"
            onChange={(e) => setTokenid(parseInt(e.target.value))}
            value={tokenId}
          />
          <button onClick={() => stake()} className="btn btn-lg btn-warning">
            Stake
          </button>
        </>
      )}
      {allowance && staked && !isPending && (
        <button onClick={() => unstake()} className="btn btn-lg btn-warning">
          Unstake
        </button>
      )}
    </>
  );
};

export default ApproveNFT;
