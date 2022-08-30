// *EXTERNALS*
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// *INTERNALS*
import { NETWORK_EXPLORER, STATUS_TYPES } from '../../constants';
import { useMintLoot } from '../../hooks/index';
import { sendTx } from '../../utils';
import LoadingBtn from '../Misc/LoadingBtn';

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
      toast.error(`Tx Error: ${state.errorMessage}`);

      setIsMinting(false);
    }
  }, [state]);

  const mint = async () => {
    if (isMinting) return;
    sendMint(userAddress, ethers.utils.formatBytes32String(name));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div className="input-group text-start mt-2 mb-2">
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
        <button onClick={() => sendTx(mint)} className="btn btn-lg btn-primary">
          Mint Loot
        </button>
      )}
    </div>
  );
};

export default Loot;
