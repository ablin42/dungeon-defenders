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
      <div className="input-group mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="10000"
          min={0}
          aria-label="amount to burn"
          onChange={(e) => handleChange(e)}
          value={parseInt(ethers.utils.formatEther(amount))}
        />
        <button onClick={() => burn()} className="btn btn-lg btn-danger">
          Burn GEMS
        </button>
      </div>
    </>
  );
};

export default BurnGems;
