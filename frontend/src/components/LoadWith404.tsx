// *EXTERNALS*
import React from 'react';

// *INTERNALS*
import NotFound from './NotFound';

interface LoadProps {
  isLoading: boolean;
}

const LoadWith404 = ({ isLoading }: LoadProps) => {
  return isLoading ? (
    <div className="text-center" style={{ height: '65vh', display: 'flex', justifyContent: 'center' }}>
      <span
        style={{ alignSelf: 'center' }}
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
    </div>
  ) : (
    <NotFound />
  );
};

export default LoadWith404;
