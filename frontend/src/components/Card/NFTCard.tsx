// *EXTERNALS*
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

// *INTERNALS*
import Equipment from '../Actions/Equipment';
import { NFTAttribute, NFT } from '../../types';

interface Props {
  NFT: NFT;
  tokenId: string | number;
  renderedImage: string;
  isLoot?: boolean;
  onClick?: (e: any) => void;
  selected?: boolean;
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

const NFTCard = ({ NFT, isLoot, tokenId, renderedImage, onClick, selected }: Props) => {
  const { name, image: nftImage, attributes } = NFT;

  const getMetadataDisplay = () => {
    return (
      <div className="card-body">
        <h5 className="card-title text-start">
          <Link to={`/NFT/${tokenId}`}>
            {attributes.find((item) => item.trait_type === 'Name')?.value
              ? attributes.find((item) => item.trait_type === 'Name')?.value
              : name}
          </Link>
        </h5>
        <div className="d-flex justify-content-between align-items-center">
          {!isLoot ? <div className="mb-3" /> : null}
          <div className="text-start card-badges">
            {attributes.map((attribute: NFTAttribute, index: number) => {
              const { trait_type, value } = attribute;
              if (trait_type === 'Name') return;
              return (
                <span key={trait_type} className={`badge bg-${BADGE_TYPE[index]} m-1`}>
                  {getTraitText(trait_type, value)}
                </span>
              );
            })}
          </div>
        </div>
        <Link to={`/NFT/${tokenId}`}>
          <div>{!isLoot && <Equipment tokenId={tokenId} />}</div>
        </Link>
      </div>
    );
  };

  return (
    <div className="col">
      <div className="card shadow" style={{ borderColor: selected ? '#2d767f' : 'rgba(140, 130, 115, 0.13)' }}>
        <div className="flip-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'initial' }}>
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
