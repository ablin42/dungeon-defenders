import React from 'react';
import Mint from './Mint';
import BurnGEMS from './BurnGEMS';
import Play from './Play';

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
      <Play userAddress={userAddress} />
      <hr />
      <Mint userAddress={userAddress} />
      <hr />
      <BurnGEMS userAddress={userAddress} />

      <hr />
      <h3>Demo actions</h3>
      {ButtonsList.map((button) => (
        <button key={button.name} type="button" className={`btn btn-${button.variant} m-2`} onClick={button.action}>
          {button.name}
        </button>
      ))}
    </>
  );
};

export default Actions;
