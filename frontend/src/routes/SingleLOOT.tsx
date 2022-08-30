// *EXTERNALS*
import React from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import { useTokenURILoot } from '../hooks/index';
import CardWrapper from '../components/Card/CardWrapper';
import { extendNFTObject } from '../utils';

export default function SingleLOOT() {
  const params = useParams();
  const { lootId } = params;
  const URI = useTokenURILoot(lootId);
  const LOOTObject = extendNFTObject(URI, lootId);

  return (
    <div className="mt-5">
      <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
        <a href="#" onClick={() => history.back()}>
          <FontAwesomeIcon icon={faCircleLeft} fontSize={25} />
        </a>
        <div className="col-8 offset-2">{LOOTObject && <CardWrapper NFT={LOOTObject} isLoot />}</div>
      </div>
    </div>
  );
}
