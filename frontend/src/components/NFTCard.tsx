// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEthers } from '@usedapp/core';

// *INTERNALS*
import Play from './Actions/Play';
import Equipment from './Actions/Equipment';
import { useStakes, useSlots } from '../hooks';
import { NFTAttribute, NFT } from '../types';
import { API_ADDRESS } from '../constants';

interface Props {
  NFT: NFT;
  owner: string;
  isLoot?: boolean;
}

const BADGE_TYPE = [
  'secondary',
  'secondary',
  'primary',
  'primary',
  'primary',
  'primary',
  'info',
  'info',
  'info',
  'info',
];

function getTraitText(trait: string, value: string | number) {
  const TRAIT_TEXT = {
    ['Name']: `${value}` || 'Unnamed',
    ['Level']: `Level ${value}`,
    ['Health']: `${value} HP`,
    ['Speed']: `${value} SPD`,
    ['Strength']: `${value} STR`,
    ['Defense']: `${value} DEF`,
    ['Dungeons Defended']: `Defended ${value} Dungeon(s)`,
    ['Dungeons Attempted']: `Attempted ${value} Dungeon(s)`,
  };

  // f*ck typescript lol
  return TRAIT_TEXT[trait as keyof unknown];
}

// TODO should make as pure as possible
const NFTCard = ({ NFT, owner, isLoot }: Props) => {
  const { name, tokenId, image: nftImage, attributes } = NFT;
  const [image, setImage] = useState(nftImage);
  const actualTokenId = tokenId || +name.replace(/^\D+/g, ''); // Trick to bypass the issue of tokenId not being set in the NFT object
  const { account } = useEthers();
  const stakes = account && useStakes(account);
  const slots = !isLoot && useSlots(actualTokenId);
  const [equipedLoot, setEquipedLoot] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);
  const [fetching, setFetching] = useState(false);
  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;
  const isOwner = account === owner;
  const isUserStakedToken = userStaking && actualTokenId == stakedId;

  const getImage = () => {
    if (fetching || actualTokenId === undefined) return;

    setFetching(true);
    const toFetch = isLoot
      ? `${API_ADDRESS}/v1/loot/${actualTokenId}/render`
      : `${API_ADDRESS}/v1/nft/${actualTokenId}/render`;
    fetch(toFetch)
      .then(async (res) => setImage(URL.createObjectURL(await res.blob())))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    getImage();
  }, [actualTokenId]);

  useEffect(() => {
    if (slots && slots !== equipedLoot) setEquipedLoot(slots);
  }, [slots.toString()]);

  const onEquipmentUpdated = (updatedSlots: number[]) => {
    setEquipedLoot(updatedSlots);
    getImage();
  };

  const getMetadataDisplay = () => {
    return (
      <div className="card-body">
        <h5 className="card-title text-start">
          <Link to={`/NFT/${actualTokenId}`}>{name}</Link>
        </h5>
        <div className="d-flex justify-content-between align-items-center">
          {!isLoot ? <div className="mb-3" /> : null}
          <div className="text-start card-badges">
            {attributes.map((attribute: NFTAttribute, index: number) => {
              const { trait_type, value } = attribute;
              return (
                <span key={trait_type} className={`badge bg-${BADGE_TYPE[index]} m-1`}>
                  {getTraitText(trait_type, value)}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          {account && !isLoot && slots && (isOwner || isUserStakedToken) && (
            <>
              <Equipment userAddress={account} tokenId={actualTokenId} onEquipmentUpdated={onEquipmentUpdated} />
              <div className="mt-2" />
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
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img className="card-img-top" src={image} alt="Rendered NFT" />
            </div>
            <div className="flip-card-back">
              <img className="card-img-top" src={nftImage} alt="Svg NFT" />
            </div>
          </div>
        </div>
        {getMetadataDisplay()}
      </div>
    </div>
  );
};

export default NFTCard;
