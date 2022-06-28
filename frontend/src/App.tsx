import React from 'react';
import { Outlet } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import Header from './components/Header';
import Footer from './components/Footer';
import ConnectWallet from './components/Actions/ConnectWallet';
import Actions from './components/Actions/Actions';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { account } = useEthers();
  return (
    <>
      <Header />
      <Toaster />
      <Outlet />
      <Footer />
    </>
  );
};

export default App;
