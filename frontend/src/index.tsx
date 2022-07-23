// *EXTERNALS*
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChainId, DAppProvider, Goerli } from '@usedapp/core';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// *INTERNALS*
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Home from './routes/Home';
import Collection from './routes/Collection';
import Error from './components/Misc/Error';
import Play from './routes/Play';
import SingleLOOT from './routes/SingleLOOT';
import About from './routes/About';
import Admin from './routes/Admin';
import Prepare from './routes/SingleNFT';

const config = {
  readOnlyChainId: ChainId.Goerli,
  readOnlyUrls: {
    [ChainId.Goerli]: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    //getDefaultProvider('goerli'),
  },
  networks: [Goerli],
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <DAppProvider config={config}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Play" element={<Play />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Collection/:userAddress" element={<Collection />} />
          <Route path="/NFT/:nftId" element={<Prepare />} />
          <Route path="/LOOT/:lootId" element={<SingleLOOT />} />

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </DAppProvider>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
