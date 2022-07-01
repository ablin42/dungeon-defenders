// *EXTERNALS*
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 80vh;
  padding-top: 15vh;
  text-align: center;
`;

const NotFound = () => (
  <>
    <Wrapper>
      <h1>This content does not exist</h1>
      <h1 className="mb-5" style={{ fontSize: '4.5rem' }}>
        404
      </h1>
      <Link to="/">
        <button className="btn btn-primary btn-lg mb-4">Go Back</button>
      </Link>
    </Wrapper>
  </>
);

export default NotFound;
