import React from 'react';
import styled from 'styled-components';
import TakeMeHome from './TakeMeHome';

const Wrapper = styled.div`
  height: 80vh;
  padding-top: 15vh;
  text-align: center;
`;

const NotFound = () => (
  <>
    <Wrapper>
      <h1>This page does not exist</h1>
      <h1 className="mb-5" style={{ fontSize: '4.5rem' }}>
        404
      </h1>
      <TakeMeHome />
    </Wrapper>
  </>
);

export default NotFound;
