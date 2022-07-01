// *EXTERNALS*
import React from 'react';

// *INTERNALS*
import { useApproveGEMS } from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY } from '../../constants';

const ApproveGEMS = () => {
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
