// *EXTERNALS*
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// *INTERNALS*
import Play from './Actions/Play';
import Equipment from './Actions/Equipment';
import { NFTAttribute, NFT } from '../types';

interface Props {
  NFT: NFT;
  isOwner: boolean;
  isUserStakedToken: string | boolean | undefined;
  tokenId: string | number;
  onEquipmentUpdated: (updatedSlots: number[]) => void;
  slots: number[] | false;
  account: string | undefined;
  renderedImage: string;
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

const NFTCard = ({
  NFT,
  isLoot,
  isOwner,
  isUserStakedToken,
  tokenId,
  onEquipmentUpdated,
  slots,
  account,
  renderedImage,
}: Props) => {
  const { name, image: nftImage, attributes } = NFT;

  const getMetadataDisplay = () => {
    return (
      <div className="card-body">
        <h5 className="card-title text-start">
          <Link to={`/NFT/${tokenId}`}>{name}</Link>
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
              <Equipment userAddress={account} tokenId={tokenId} onEquipmentUpdated={onEquipmentUpdated} />
              <div className="mt-2" />
              <Play userAddress={account} tokenId={tokenId} equipedLoot={slots} />
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
              <img className="card-img-top" src={renderedImage} alt="Rendered NFT" />
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

export default memo(NFTCard);
