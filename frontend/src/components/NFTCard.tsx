import React from 'react';
import { Link } from 'react-router-dom';
import { NFT } from '../types';

interface Props {
  NFT: NFT;
}

// TODO keeping it here for now, can be removed later once NFTCardAlternative fully implemented

const BADGE_TYPE = ['primary', 'info', 'success', 'danger', 'warning', 'secondary'];

const NFTCard = ({ NFT }: Props) => {
  const { name, description, tokenId, image, external_url, attributes } = NFT;

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
            <a href="#">{external_url.substring(8)}</a>
          </b>
          <small className="text-muted" style={{ textAlign: 'right' }}>
            {Object.entries(attributes).map((attribute: any, index: number) => {
              const [key, value] = attribute;
              return (
                <span key={key} className={`badge bg-${BADGE_TYPE[index]} m-1`}>
                  {key}: {value}
                </span>
              );
            })}
          </small>
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
