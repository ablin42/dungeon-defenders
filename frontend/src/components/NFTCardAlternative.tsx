import React from 'react';
import { Link } from 'react-router-dom';
import { NFTAttribute, NFTALT } from '../types';
import { useEthers } from '@usedapp/core';
import Play from './Actions/Play';
import { useOwnerOf, useStakes } from '../hooks';

interface Props {
  NFT: NFTALT;
}

// Just for temporary demo purposes
const BADGE_TYPE = ['primary', 'info', 'success', 'danger', 'warning', 'secondary', 'primary', 'info'];

const NFTCard = ({ NFT }: Props) => {
  const { account } = useEthers();
  const { name, description, tokenId, image, external_url, attributes } = NFT;
  const owner = useOwnerOf(tokenId);
  const stakes = account && useStakes(account);
  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;

  const getMetadataDisplay = () => {
    return (
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/NFT/${tokenId}`}>{name}</Link>
        </h5>
        <p className="card-text">{description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <b>
            ID#{tokenId}
            <br />
            <a href="#">{external_url.substring(7)}</a>
          </b>
          <small className="text-muted" style={{ textAlign: 'right' }}>
            {attributes.map((attribute: NFTAttribute, index: number) => {
              const { trait_type, value } = attribute;
              return (
                <span key={trait_type} className={`badge bg-${BADGE_TYPE[index]} m-1`}>
                  {trait_type}: {value}
                </span>
              );
            })}
          </small>
        </div>
        <div>
          {/* Ugly condition */}
          {((account && account === owner) || (account && userStaking && tokenId == stakedId)) && (
            <Play userAddress={account} tokenId={tokenId} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="col">
      <div className="card shadow-sm">
        <img className="card-img-top" src={image} alt="Card cap" />
        {getMetadataDisplay()}
      </div>
    </div>
  );
};

export default NFTCard;
