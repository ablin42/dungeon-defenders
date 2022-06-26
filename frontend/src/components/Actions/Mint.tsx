import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMint } from '../../hooks/index';

type ActionProps = {
  userAddress: string;
};

const Mint: React.FC<ActionProps> = ({ userAddress }) => {
  const navigate = useNavigate();
  const [isMinting, setIsMinting] = useState(false);
  const { state, send: sendMint } = useMint();

  useEffect(() => {
    setIsMinting(state.status !== 'None');
    if (state.status === 'Success') {
      const tokenIdHex = state.receipt?.logs[0].topics[3].replace('0x', '');

      if (!tokenIdHex) {
        setIsMinting(false);
        return;
      }

      const tokenId = parseInt(tokenIdHex, 16);
      setTimeout(() => {
        // hack to give the server enough time to be notified of the mint event
        navigate(`/NFT/${tokenId}`, { replace: true });
        setIsMinting(false);
      }, 5000);
    }
    if (state.status === 'Exception' || state.status === 'Fail') {
      setIsMinting(false);
    }
  }, [state]);

  const mint = async () => {
    if (isMinting) {
      return;
    }

    sendMint(userAddress);
  };

  return (
    <button onClick={() => mint()} className="btn btn-lg btn-primary">
      {isMinting ? (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span className="sr-only">Minting...</span>
        </>
      ) : (
        'Mint'
      )}
    </button>
  );
};

export default Mint;
