import React from 'react';

interface BtnProps {
  type?: string;
  text?: string;
}

const LoadingBtn = ({ type = 'primary', text = 'Tx Pending...' }: BtnProps) => {
  return (
    <button className={`btn btn-lg btn-${type}`}>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span className="sr-only">{text}</span>
    </button>
  );
};

export default LoadingBtn;
