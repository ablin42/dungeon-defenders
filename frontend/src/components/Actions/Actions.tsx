import React from 'react';
import BurnGEMS from './BurnGEMS';
import Play from './Play';

// TODO left to implement
const ButtonsList = [
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
];

type ActionProps = {
  userAddress: string;
};

const Actions: React.FC<ActionProps> = ({ userAddress }) => {
  return (
    <>
      <div className="col-8 offset-2 pt-5 pb-5 mt-5">
        <h1 className="fw-light">Start Playing</h1>
        <Play userAddress={userAddress} />
        <h1 className="fw-light mt-5">Burn some Gems</h1>
        <BurnGEMS userAddress={userAddress} />

        {/* <hr />
      <h3>Demo actions</h3>
      {ButtonsList.map((button) => (
        <button key={button.name} type="button" className={`btn btn-${button.variant} m-2`} onClick={button.action}>
          {button.name}
        </button>
      ))} */}
      </div>
    </>
  );
};

export default Actions;
