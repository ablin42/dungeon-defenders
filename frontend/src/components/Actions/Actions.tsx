import React from 'react';
import Mint from './Mint';
import Stake from './Stake';
import ApproveNFT from './ApproveNFT';
import Unstake from './Unstake';

const ButtonsList = [
  {
    name: 'Mint',
    variant: 'primary',
    action: () => console.log('Mint'),
  },
  {
    name: 'Level Up',
    variant: 'primary',
    action: () => console.log('Level Up'),
  },
  {
    name: 'Evolve',
    variant: 'primary',
    action: () => console.log('Evolve'),
  },
  {
    name: 'Stake',
    variant: 'danger',
    action: () => console.log('Stake'),
  },
  {
    name: 'Unstake',
    variant: 'danger',
    action: () => console.log('Unstake'),
  },
  {
    name: 'Approve',
    variant: 'success',
    action: () => console.log('Approve'),
  },
  {
    name: 'Burn',
    variant: 'success',
    action: () => console.log('Burn'),
  },
];

type ActionProps = {
  userAddress: string;
};

const Actions: React.FC<ActionProps> = ({ userAddress }) => {
  return (
    <>
      <Mint userAddress={userAddress} />
      <Stake userAddress={userAddress} />
      <ApproveNFT userAddress={userAddress} />
      <Unstake userAddress={userAddress} />
      {ButtonsList.map((button) => (
        <button key={button.name} type="button" className={`btn btn-${button.variant} m-2`} onClick={button.action}>
          {button.name}
        </button>
      ))}
    </>
  );
};

export default Actions;
