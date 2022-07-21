// *EXTERNALS*
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';

// *INTERNALS*
import Header from './components/Header';
import Footer from './components/Footer';
import Toggler from './components/Misc/Toggler';

const StyledOutlet = styled.div`
  flex: 1 0 auto;
`;

const App = () => {
  return (
    <>
      <Header />
      <Toggler></Toggler>
      <Toaster
        toastOptions={{
          duration: 5000,
          position: 'top-right',
          error: {
            icon: '❌',
          },
          success: {
            icon: '✅',
          },
          loading: {
            icon: '⏳',
          },
        }}
      />
      <StyledOutlet>
        <Outlet />
      </StyledOutlet>

      <Footer />
    </>
  );
};

export default App;
