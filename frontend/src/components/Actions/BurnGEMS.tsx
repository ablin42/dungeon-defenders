import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useBurnGEMS } from '../../hooks/index';

type ActionProps = {
  userAddress: string;
};

const ApproveGEMS: React.FC<ActionProps> = ({ userAddress }) => {
  const { state, send: sendBurn } = useBurnGEMS();

  const burn = async () => {
    const amount = ethers.utils.parseEther('1');
    sendBurn(amount);
  };

  return (
    <button onClick={() => burn()} className="btn btn-lg btn-primary">
      Burn GEMS
    </button>
  );
};

export default ApproveGEMS;
