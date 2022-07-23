// *EXTERNALS*
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import CardWrapper from './CardWrapper';
import type { NFT } from '../../types';

interface Props {
  isLoot?: boolean;
  NFT: NFT;
}

export default function BasicNFTDisplay({ isLoot = false, NFT }: Props) {
  return (
    <div className="mt-5">
      <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
        <a href="#" onClick={() => history.back()}>
          <FontAwesomeIcon icon={faCircleLeft} fontSize={25} />
        </a>
        <div className="col-8 offset-2">{NFT && <CardWrapper NFT={NFT} isLoot={isLoot} />}</div>
      </div>
    </div>
  );
}
