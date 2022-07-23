// *EXTERNALS*
import React from 'react';
import { useEthers } from '@usedapp/core';

function ConnectWallet() {
  const { activateBrowserWallet, account } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return (
    <>
      {account ? (
        <button type="button" className="btn w-75 btn-outline-primary">
          {account.slice(0, 6)}...
          {account.slice(account.length - 4, account.length)}
        </button>
      ) : (
        <button onClick={() => handleConnectWallet()} className="btn btn-primary">
          Connect
        </button>
      )}
    </>
  );
}

export default ConnectWallet;
