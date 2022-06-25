import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useStake, useUnstake, useApprove, useAllowance } from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS } from '../../constants';

type ActionProps = {
  userAddress: string;
};

const ApproveNFT: React.FC<ActionProps> = ({ userAddress }) => {
  const [tokenId, setTokenid] = useState(0);
  const { state: approveState, send: sendApprove } = useApprove();
  const { state: stakeState, send: sendStake } = useStake();
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const allowance = useAllowance(userAddress);
  const staked = false; // TODO

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
      {!allowance && (
        <button onClick={() => approve()} className="btn btn-lg btn-warning">
          Approve
        </button>
      )}
      {allowance && !staked && (
        <>
          <input
            type="number"
            className="form-control"
            placeholder="1337"
            aria-label=" Token #ID"
            aria-describedby="basic-addon2"
            onChange={(e) => setTokenid(parseInt(e.target.value))}
            value={tokenId}
          />
          <button onClick={() => stake()} className="btn btn-lg btn-warning">
            Stake
          </button>
        </>
      )}
      {allowance && staked && (
        <button onClick={() => unstake()} className="btn btn-lg btn-warning">
          Unstake
        </button>
      )}
    </>
  );
};

export default ApproveNFT;
