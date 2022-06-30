import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const App = () => {
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
