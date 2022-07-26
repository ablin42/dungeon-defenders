// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';

type ActionProps = {
  userAddress: string;
};

const Actions: React.FC<ActionProps> = ({ userAddress }) => {
  return (
    <>
      <div className="col-8 offset-2 pt-5 pb-5 mt-5">
        <h1 className="fw-light">Start Playing</h1>
        <Link to={`/Collection/${userAddress}`}>
          <button className="btn btn-primary btn-lg mb-4">Play</button>
        </Link>
      </div>
    </>
  );
};

export default Actions;
