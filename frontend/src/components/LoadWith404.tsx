// *EXTERNALS*
import React from 'react';

// *INTERNALS*
import Error from './Error';

interface LoadProps {
  isLoading: boolean;
}

const LoadWith404 = ({ isLoading }: LoadProps) => {
  return isLoading ? (
    <div className="text-center">
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </div>
  ) : (
    <Error />
  );
};

export default LoadWith404;
