// *EXTERNALS*
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TransactionStatus } from '@usedapp/core';
import { useNavigate } from 'react-router-dom';

// *INTERNALS*
import {
  useStake,
  useUnstake,
  useApprove,
  useAllowance,
  useAllowanceGEMS,
  useIsStaked,
  useApproveGEMS,
  useStakes,
} from '../../hooks/index';
import { STAKE_CONTRACT_ADDRESS, STATUS_TYPES, GEMS_TOTAL_SUPPLY, NETWORK_EXPLORER } from '../../constants';
import LoadingBtn from '../LoadingBtn';
import { sendTx } from '../../utils';

type ActionProps = {
  userAddress: string;
  tokenId: number | string;
  equipedLoot: Array<number>;
};

type FormProps = {
  value: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  children: React.ReactNode;
};

const FormUtil = ({ value, onChange, children }: FormProps) => {
  return (
    <div className="form-group text-start ms-1 me-1">
      <label htmlFor="gemsAmount">Gems Amount (min. 100)</label>
      <div className="input-group">
        <input
          type="number"
          className="form-control"
          placeholder="100"
          min={100}
          aria-label="Gems Amount"
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
        {children}
      </div>
    </div>
  );
};

const Play: React.FC<ActionProps> = ({ userAddress, tokenId, equipedLoot }) => {
  // *HOOKS*
  const navigate = useNavigate();
  const { state: approveNFTState, send: sendApproveNFT } = useApprove();
  const { state: approveGEMSState, send: sendApproveGEMS } = useApproveGEMS();
  const { state: stakeState, send: sendStake } = useStake();
  const { state: unstakeState, send: sendUnstake } = useUnstake();
  const stakes = userAddress && useStakes(userAddress);
  const NFTallowance = useAllowance(userAddress);
  const GEMSallowance = useAllowanceGEMS(userAddress);
  const staked = useIsStaked(userAddress);
  const stakedId = stakes && +stakes.tokenId;
  const claimable = staked && stakes.isClaimable;
  // *STATE*
  const [isPending, setIsPending] = useState(false);
  const [gemsAmount, setGemsAmount] = useState('100');
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([
    approveNFTState,
    approveGEMSState,
    stakeState,
    unstakeState,
  ]);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = JSON.parse(JSON.stringify(STATES));
    newSTATES[index].status = STATUS_TYPES.NONE;
    setSTATES(newSTATES);
    setIsPending(false);
  };

  useEffect(() => {
    setSTATES([approveNFTState, approveGEMSState, stakeState, unstakeState]);
  }, [approveNFTState, approveGEMSState, stakeState, unstakeState]);

  useEffect(() => {
    const STATUS = STATES.map((state) => state.status as string);
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const targetedState = STATES[successIndex];
      handleStateChange(STATES, successIndex);

      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
            {targetedState.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
      );

      if (successIndex === 2) {
        setTimeout(async () => {
          navigate(`/Play`, {
            replace: true,
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
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
      handleStateChange(STATES, statusIndex);

      toast.error(`Tx Error: ${STATES[statusIndex].errorMessage}`);
    }
  }, [STATES]);

  const approveNFT = async () => {
    sendApproveNFT(STAKE_CONTRACT_ADDRESS, true);
  };
  const approveGEMS = async () => {
    sendApproveGEMS(STAKE_CONTRACT_ADDRESS, GEMS_TOTAL_SUPPLY);
  };
  const stake = async () => {
    const formattedGemsAmount = ethers.utils.parseEther(gemsAmount);
    sendStake(tokenId, equipedLoot[0], equipedLoot[1], equipedLoot[2], formattedGemsAmount);
  };
  const unstake = async () => {
    sendUnstake();
  };

  // To handle loading state when sending stake action
  if (isPending && NFTallowance && GEMSallowance && !staked)
    return (
      <FormUtil value={gemsAmount} onChange={setGemsAmount}>
        <LoadingBtn type="success" />
      </FormUtil>
    );
  // To handle loading state when sending any other action
  if (isPending) return <LoadingBtn type="success" fullWidth="w-100" />;
  // To handle loading state with no button (loading up the page for the 1st time)
  if (NFTallowance === undefined && GEMSallowance === undefined && staked === undefined)
    return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;

  return (
    <>
      {!NFTallowance && (
        <button onClick={() => sendTx(approveNFT)} className="btn btn-lg btn-success">
          Approve NFTs
        </button>
      )}
      {!GEMSallowance && NFTallowance && (
        <button onClick={() => sendTx(approveGEMS)} className="btn btn-lg btn-success">
          Approve GEMS
        </button>
      )}
      {NFTallowance && GEMSallowance && !staked ? (
        <FormUtil value={gemsAmount} onChange={setGemsAmount}>
          <button onClick={() => sendTx(stake)} className="btn btn-lg btn-success">
            Stake & Play
          </button>
        </FormUtil>
      ) : null}
      {NFTallowance && GEMSallowance && staked && tokenId == stakedId ? (
        <>
          {!claimable ? (
            <>
              <span className="muted-text">Game not finished yet</span>
              <br />
            </>
          ) : null}
          <button
            onClick={() =>
              navigate(`/Play`, {
                state: {
                  owner: userAddress,
                  defenderId: tokenId,
                  weaponId: equipedLoot[0],
                  armorId: equipedLoot[1],
                  bootsId: equipedLoot[2],

                  gemsAmount,
                },
              })
            }
            className="btn btn-lg btn-success w-100"
          >
            Play
          </button>
          <button onClick={() => sendTx(unstake)} className="btn btn-lg btn-success w-100" disabled={!claimable}>
            Claim
          </button>
        </>
      ) : null}
    </>
  );
};

export default Play;
