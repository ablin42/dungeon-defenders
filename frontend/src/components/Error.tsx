// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 80vh;
  padding-top: 15vh;
  text-align: center;
`;

interface ErrorProps {
  title?: string;
  btnText?: string;
  error?: string;
  url?: string;
}

const Error = ({
  title = 'This content does not exist',
  btnText = 'Go Back',
  error = '404',
  url = '/',
}: ErrorProps) => (
  <>
    <Wrapper>
      <h1>{title}</h1>
      <h1 className="mb-5" style={{ fontSize: '4.5rem' }}>
        {error}
      </h1>
      <Link to={url}>
        <button className="btn btn-primary btn-lg mb-4" style={{ width: 'auto' }}>
          {btnText}
        </button>
      </Link>
    </Wrapper>
  </>
);

export default Error;
