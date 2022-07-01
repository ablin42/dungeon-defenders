// *EXTERNALS*
import React from 'react';

interface BtnProps {
  type?: string;
  text?: string;
  width?: string;
}

const LoadingBtn = ({ type = 'primary', text = 'Tx Pending...', width }: BtnProps) => {
  return (
    <button className={`btn btn-lg btn-${type}`} style={{ width: width ? width : 'initial' }}>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span className="sr-only">{text}</span>
    </button>
  );
};

export default LoadingBtn;
