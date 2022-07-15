// *EXTERNALS*
import React from 'react';
import { STAKE_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import { useApproveGEMS } from '../../hooks/index';
import { GEMS_TOTAL_SUPPLY } from '../../constants';

const ApproveGEMS = () => {
  const { state, send: sendApprove } = useApproveGEMS();

  const approve = async () => {
    sendApprove(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };

  return (
    <button onClick={() => approve()} className="btn btn-lg btn-primary">
      Approve <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} />
    </button>
  );
};

export default ApproveGEMS;
