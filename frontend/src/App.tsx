// *EXTERNALS*
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// *INTERNALS*
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <>
      <Header />
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
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
