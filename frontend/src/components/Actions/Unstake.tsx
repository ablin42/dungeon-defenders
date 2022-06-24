import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useUnstake } from '../../hooks/index';

type ActionProps = {
  userAddress: string;
};

const Unstake: React.FC<ActionProps> = ({ userAddress }) => {
  const { state, send: sendUnstake } = useUnstake();

  const unstake = async () => {
    sendUnstake();
  };

  return (
    <button onClick={() => unstake()} className="btn btn-lg btn-primary">
      Unstake
    </button>
  );
};

export default Unstake;
