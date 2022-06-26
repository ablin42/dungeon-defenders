import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useApproveGEMS } from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY } from '../../constants';

type ActionProps = {
  userAddress: string;
};

const ApproveGEMS: React.FC<ActionProps> = ({ userAddress }) => {
  const { state, send: sendApprove } = useApproveGEMS();

  const approve = async () => {
    sendApprove(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };

  return (
    <button onClick={() => approve()} className="btn btn-lg btn-primary">
      Approve GEMS
    </button>
  );
};

export default ApproveGEMS;
