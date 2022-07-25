// *EXTERNALS*
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { TransactionState, TransactionStatus } from '@usedapp/core';
import { Link, useNavigate } from 'react-router-dom';
import { STAKE_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import {
  useStake,
  useApprove,
  useAllowance,
  useAllowanceGEMS,
  useIsStaked,
  useApproveGEMS,
  useStakes,
  useApproveLoot,
  useAllowanceLoot,
} from '../../hooks/index';
import { STATUS_TYPES, GEMS_TOTAL_SUPPLY } from '../../constants';
import LoadingBtn from '../Misc/LoadingBtn';
import Claim from '../Claim';
import { sendTx, handleTxStatus, getExpiration } from '../../utils';

type ActionProps = {
  userAddress: string;
  tokenId: number | string;
  equipedLoot: Array<number>;
  gemsAmount: number;
};

const STATE_INDEX = {
  APPROVENFT: 0,
  APPROVEGEMS: 1,
  STAKE: 2,
  APPROVELOOT: 3,
};

const Play: React.FC<ActionProps> = ({ userAddress, tokenId, equipedLoot, gemsAmount }) => {
  // *HOOKS*
  const navigate = useNavigate();
  const { state: approveNFTState, send: sendApproveNFT } = useApprove();
  const { state: approveGEMSState, send: sendApproveGEMS } = useApproveGEMS();
  const { state: stakeState, send: sendStake } = useStake();
  const { state: approveLOOTState, send: sendApproveLOOT } = useApproveLoot();

  const stakes = userAddress && useStakes(userAddress);
  const NFTallowance = useAllowance(userAddress);
  const LOOTAllowance = useAllowanceLoot(userAddress);
  const GEMSallowance = useAllowanceGEMS(userAddress, STAKE_CONTRACT_ADDRESS);
  const staked = useIsStaked(userAddress);
  const claimable = staked && stakes && stakes.isClaimable;
  // *STATE*
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([
    approveNFTState,
    approveGEMSState,
    stakeState,
    approveLOOTState,
  ]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);
  const { expired } = getExpiration(stakes);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([approveNFTState, approveGEMSState, stakeState, approveLOOTState]);
  }, [approveNFTState, approveGEMSState, stakeState, approveLOOTState]);

  useEffect(() => {
    const successHandler = (index: number) => {
      if (index === 2) {
        setTimeout(async () => {
          navigate(`/Play`, {
            replace: false,
            state: {
              owner: userAddress,
              defenderId: tokenId,
              weaponId: equipedLoot[0],
              armorId: equipedLoot[1],
              bootsId: equipedLoot[2],
              gemsAmount,
            },
          });
        }, 5000);
      }
    };

    handleTxStatus(STATES, STATUS, handleStateChange, successHandler);
  }, [STATES]);

  const approveNFT = async () => {
    sendApproveNFT(STAKE_CONTRACT_ADDRESS, true);
  };
  const approveLOOT = async () => {
    sendApproveLOOT(STAKE_CONTRACT_ADDRESS, true);
  };
  const approveGEMS = async () => {
    sendApproveGEMS(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };
  const stake = async () => {
    const formattedGemsAmount = ethers.utils.parseEther(gemsAmount.toString());
    sendStake(tokenId, equipedLoot[0], equipedLoot[1], equipedLoot[2], formattedGemsAmount);
  };

  if (
    isPending[STATE_INDEX.APPROVENFT] ||
    isPending[STATE_INDEX.APPROVEGEMS] ||
    isPending[STATE_INDEX.STAKE] ||
    isPending[STATE_INDEX.APPROVELOOT]
  )
    return <LoadingBtn type="primary" width="100%" />;
  // To handle loading state with no button (loading up the page for the 1st time)
  if (NFTallowance === undefined && LOOTAllowance === undefined && GEMSallowance === undefined && staked === undefined)
    return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;

  return (
    <>
      {!NFTallowance && (
        <button onClick={() => sendTx(approveNFT)} className="btn btn-lg btn-primary w-100">
          Approve DEFENDERS for staking
        </button>
      )}
      {!LOOTAllowance && NFTallowance && (
        <button onClick={() => sendTx(approveLOOT)} className="btn btn-lg btn-primary w-100">
          Approve LOOT
        </button>
      )}
      {!GEMSallowance && LOOTAllowance && NFTallowance && (
        <button onClick={() => sendTx(approveGEMS)} className="btn btn-lg btn-primary w-100">
          Approve GEMS <FontAwesomeIcon className="fa-icon fa-white" icon={faGem} fontSize={15} /> for staking
        </button>
      )}
      {NFTallowance && LOOTAllowance && GEMSallowance && !staked ? (
        <button onClick={() => sendTx(stake)} className="btn btn-lg btn-primary w-100">
          Stake &amp; Play
        </button>
      ) : null}
      {NFTallowance && LOOTAllowance && GEMSallowance && staked && !expired ? (
        <>
          <Link to={`/Play`}>
            <button className="btn btn-lg btn-info w-100">
              {claimable ? (
                'Claim pending 🎉'
              ) : (
                <>
                  {'Game in progress '}
                  <div className="ms-2 spinner-border spinner-border-sm text-light" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              )}
            </button>
          </Link>
        </>
      ) : null}
      {NFTallowance && LOOTAllowance && GEMSallowance && staked && expired ? <Claim expired={expired} /> : null}
    </>
  );
};

export default Play;
