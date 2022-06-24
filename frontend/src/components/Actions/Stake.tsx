import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useStake } from '../../hooks/index';

type ActionProps = {
  userAddress: string;
};

const Stake: React.FC<ActionProps> = ({ userAddress }) => {
  const { state, send: sendStake } = useStake();

  const stake = async () => {
    const tokenId = 0;
    const amount = ethers.utils.parseEther('1');
    sendStake(tokenId, amount);
  };

  return (
    <button onClick={() => stake()} className="btn btn-lg btn-primary">
      Stake
    </button>
  );
};

export default Stake;
