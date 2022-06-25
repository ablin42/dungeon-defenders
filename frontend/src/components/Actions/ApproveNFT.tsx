import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useApprove, useAllowance } from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS } from '../../constants';

type ActionProps = {
  userAddress: string;
};

const ApproveNFT: React.FC<ActionProps> = ({ userAddress }) => {
  const { state, send: sendApprove } = useApprove();
  const allowance = useAllowance();

  const approve = async () => {
    sendApprove(STAKE_CONTRACT_ADDRESS, true);
  };

  return (
    <button onClick={() => approve()} className="btn btn-lg btn-primary">
      {`Approve / ${allowance}`}
    </button>
  );
};

export default ApproveNFT;
