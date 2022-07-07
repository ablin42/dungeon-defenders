// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding-top: 15vh;
  text-align: center;
`;

const StyledErrorCode = styled.h1`
  font-size: 4.5rem;
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
      <StyledErrorCode className="mb-5">{error}</StyledErrorCode>
      <Link to={url}>
        <button className="btn btn-primary btn-lg mb-4 w-auto">{btnText}</button>
      </Link>
    </Wrapper>
  </>
);

export default Error;
