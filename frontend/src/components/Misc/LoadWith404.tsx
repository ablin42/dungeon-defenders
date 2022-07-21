// *EXTERNALS*
import React from 'react';

// *INTERNALS*
import Error from './Error';

interface LoadProps {
  isLoading: boolean;
  title?: string;
  btnText?: string;
  error?: string;
  url?: string;
}

const LoadWith404 = ({ isLoading, title, btnText, error, url }: LoadProps) => {
  return isLoading ? (
    <div className="text-center">
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </div>
  ) : (
    <Error title={title} error={error} btnText={btnText} url={url} />
  );
};

export default LoadWith404;
