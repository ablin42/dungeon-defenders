import React from 'react';
import { Link } from 'react-router-dom';
import { NFTAttribute, NFT } from '../types';
import { useEthers } from '@usedapp/core';
import Play from './Actions/Play';
import Equipment from './Actions/Equipment';
import { useStakes, useSlots } from '../hooks';

interface Props {
  NFT: NFT;
  owner: string;
  isLoot?: boolean;
}

const BADGE_TYPE = ['primary', 'primary', 'success', 'success', 'success', 'success', 'info', 'info', 'info', 'info'];

// TODO should be somewhat pure
const NFTCard = ({ NFT, owner, isLoot }: Props) => {
  const { name, description, tokenId, image, external_url, attributes } = NFT;
  const actualTokenId = tokenId || +name.replace(/^\D+/g, ''); // Trick to bypass the issue of tokenId not being set in the NFT object
  const { account } = useEthers();
  const stakes = account && useStakes(account);
  const slots = useSlots(tokenId);
  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;
  const isOwner = account === owner;
  const isUserStakedToken = userStaking && actualTokenId == stakedId;

  const getMetadataDisplay = () => {
    return (
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/NFT/${actualTokenId}`}>{name}</Link>
        </h5>
        <p className="card-text">{description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <b>
            ID#{actualTokenId}
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
          {account && !isLoot && (isOwner || isUserStakedToken) && (
            <>
              <Equipment userAddress={account} tokenId={actualTokenId} />
              <Play userAddress={account} tokenId={actualTokenId} equipedLoot={slots} />
            </>
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
