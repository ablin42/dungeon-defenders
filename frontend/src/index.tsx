import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DAppProvider } from '@usedapp/core';
import AllNFT from './routes/AllNFT';
import Home from './routes/Home';
import UserNFT from './routes/UserNFT';
import SingleNFT from './routes/SingleNFT';
import NotFound from './components/NotFound';

const config = {
  readOnlyChainId: 5,
  readOnlyUrls: {
    [5]: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  },
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DAppProvider config={config}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/NFT" element={<AllNFT />} />
            <Route path="/NFT/user/:userId" element={<UserNFT />} />
            <Route path="/NFT/:nftId" element={<SingleNFT />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </DAppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
