import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useApprove } from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS } from '../../constants';

type ActionProps = {
  userAddress: string;
};

const ApproveNFT: React.FC<ActionProps> = ({ userAddress }) => {
  const { state, send: sendApprove } = useApprove();

  const approve = async () => {
    const tokenId = 0;
    sendApprove(STAKE_CONTRACT_ADDRESS, tokenId);
  };

  return (
    <button onClick={() => approve()} className="btn btn-lg btn-primary">
      Approve
    </button>
  );
};

export default ApproveNFT;
