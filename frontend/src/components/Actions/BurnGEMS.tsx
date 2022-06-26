import { ethers, BigNumberish } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useBurnGEMS, useAllowanceGEMS } from '../../hooks/index';

type ActionProps = {
  userAddress: string;
};

const BurnGems: React.FC<ActionProps> = ({ userAddress }) => {
  const [amount, setAmount] = useState<BigNumberish>('0');
  const { state, send: sendBurn } = useBurnGEMS();
  const allowance = useAllowanceGEMS(userAddress);

  const burn = async () => {
    sendBurn(amount);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(ethers.utils.parseEther(value));
  };

  return (
    <>
      <input
        type="number"
        className="form-control"
        placeholder="10000"
        aria-label="amount to burn"
        onChange={(e) => handleChange(e)}
        value={parseInt(ethers.utils.formatEther(amount))}
      />
      <button onClick={() => burn()} className="btn btn-lg btn-primary">
        Burn GEMS (Allowance: {allowance})
      </button>
    </>
  );
};

export default BurnGems;
