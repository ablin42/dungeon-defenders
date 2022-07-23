// *EXTERNALS*
import React, { memo } from 'react';

// *INTERNALS*
import { NFT } from '../../types';

interface Props {
  NFT: NFT;
  renderedImage: string;
  disabledFlip?: boolean;
}

const SmallNFTCard = ({ NFT, renderedImage, disabledFlip }: Props) => {
  const { image: nftImage } = NFT;

  return (
    <div className="col">
      <div className="card shadow">
        {disabledFlip ? (
          <img className="card-img-top" src={renderedImage} alt="Rendered NFT" />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default memo(SmallNFTCard);
