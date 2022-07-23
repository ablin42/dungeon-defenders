// *EXTERNALS*
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGun, faShirt, faShoePrints } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';

// *INTERNALS*
import { useOwnerOf, useSlots } from '../../hooks/index';
import { API_ADDRESS } from '../../constants';
import CardWrapper from '../Card/CardWrapper';
import { NFT } from '../../types';

type ActionProps = {
  tokenId: number | string;
  onEquipmentUpdated?: (slots: number[]) => void;
};

const fetcher = (params: any) => fetch(params).then((res) => res.json());

const Equipment: React.FC<ActionProps> = ({ tokenId }) => {
  // *HOOKS*
  const slots = useSlots(tokenId);
  const owner = useOwnerOf(tokenId);
  const { data: userLOOT } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${owner}`, fetcher);
  // *STATE*
  const [loots, setLoots] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);

  useEffect(() => {
    if (slots !== loots) setLoots(slots);
  }, [slots.toString()]);

  const findLoot = (lootId: number) => {
    if (!userLOOT) return -1;
    return userLOOT.findIndex((loot: NFT) => +loot.name.substring(6) === lootId);
  };

  const getLootList = () => {
    return (
      <>
        <div className="d-flex mt-3">
          <div className="col-4">
            <div className="shadow-sm small-loot-wrapper">
              {findLoot(slots[0]) >= 0 && loots[0] > 0 ? (
                <CardWrapper NFT={userLOOT[findLoot(slots[0])]} isLoot isSmall disabledFlip />
              ) : (
                <FontAwesomeIcon icon={faGun} fontSize={45} color="#232628" />
              )}
            </div>
          </div>
          <div className="col-4">
            <div className="shadow-sm small-loot-wrapper">
              {findLoot(slots[1]) >= 0 && loots[1] > 0 ? (
                <CardWrapper NFT={userLOOT[findLoot(slots[1])]} isLoot isSmall />
              ) : (
                <FontAwesomeIcon icon={faShirt} fontSize={45} color="#232628" />
              )}
            </div>
          </div>
          <div className="col-4">
            <div className="shadow-sm small-loot-wrapper">
              {findLoot(slots[2]) >= 0 && loots[2] > 0 ? (
                <CardWrapper NFT={userLOOT[findLoot(slots[2])]} isLoot isSmall />
              ) : (
                <FontAwesomeIcon icon={faShoePrints} fontSize={45} color="#232628" />
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return <>{getLootList()}</>;
};

export default Equipment;
