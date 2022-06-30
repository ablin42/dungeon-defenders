import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NETWORK_EXPLORER, STATUS_TYPES } from '../../constants';
import { useMintLoot } from '../../hooks/index';
import toast from 'react-hot-toast';
import LoadingBtn from '../LoadingBtn';

type ActionProps = {
  userAddress: string;
};

const Loot: React.FC<ActionProps> = ({ userAddress }) => {
  const navigate = useNavigate();
  const [isMinting, setIsMinting] = useState(false);
  const [name, setName] = useState('');
  const { state, send: sendMint } = useMintLoot();

  useEffect(() => {
    setIsMinting(state.status !== STATUS_TYPES.NONE);
    if (state.status === STATUS_TYPES.SUCCESS) {
      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${state.receipt?.transactionHash}`}>
            {state.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
        {
          icon: '✅',
          position: 'top-right',
        },
      );
      // Ignore 0x & take first 64 characters representing tokenID
      const tokenIdHex = state.receipt?.logs[0].data.substring(2, 66);

      if (!tokenIdHex) {
        setIsMinting(false);
        return;
      }

      const tokenId = parseInt(tokenIdHex, 16);
      setTimeout(() => {
        // hack to give the server enough time to be notified of the mint event
        navigate(`/LOOT/${tokenId}`, { replace: true });
        setIsMinting(false);
      }, 5000);
    }
    if (state.status === STATUS_TYPES.EXCEPTION || state.status === STATUS_TYPES.FAIL) {
      toast.error(`Tx Error: ${state.errorMessage}`, {
        icon: '❌',
        position: 'top-right',
      });

      setIsMinting(false);
    }
  }, [state]);

  const mint = async () => {
    if (isMinting) {
      return;
    }
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    sendMint(userAddress, ethers.utils.formatBytes32String(name));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="col-8 offset-2 mt-4">
      <label htmlFor="gemsAmount">{'Your Loot Name'}</label>
      <div className="input-group text-start mt-2">
        <input
          type="text"
          className="form-control"
          placeholder="Lootbaggies"
          aria-label="defender name"
          onChange={(e) => handleChange(e)}
          value={name}
        />
        {isMinting ? (
          <LoadingBtn text={'Minting...'} />
        ) : (
          <button onClick={() => mint()} className="btn btn-lg btn-primary">
            Mint Loot
          </button>
        )}
      </div>
    </div>
  );
};

export default Loot;