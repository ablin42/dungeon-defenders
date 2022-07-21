// *EXTERNALS*
import React from 'react';
import Button from '../Button';

interface BtnProps {
  type?: string;
  text?: string;
  width?: string;
}

const LoadingBtn = ({ type = 'primary', text = 'Tx Pending...', width }: BtnProps) => {
  return (
    <Button btnType={type} width={width}>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span className="sr-only">{text}</span>
    </Button>
  );
};

export default LoadingBtn;
