// *EXTERNALS*
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faShoePrints, faGun } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';

// *INTERNALS*
import { useOwnerOf, useSlots } from '../../hooks/index';
import { API_ADDRESS } from '../../constants';
import CardWrapper from '../Card/CardWrapper';
import Modal from '../Misc/NFTModal';
import StakeSection from './StakeSection';
import type { NFT } from '../../types';

const LOOT = [
  {
    icon: faGun,
  },
  {
    icon: faShirt,
  },
  {
    icon: faShoePrints,
  },
];

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function Prepare({ account, NFT }: { account: string; NFT: NFT }) {
  /* HOOKS */
  const owner = useOwnerOf(NFT?.tokenId);
  const slots = useSlots(NFT?.tokenId);
  const { data: userLOOT } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${owner}`, fetcher);
  /* STATE */
  const [open, setOpen] = useState<number | null>(null);

  const findLoot = (lootId: number) => {
    if (!userLOOT) return -1;
    return userLOOT.findIndex((loot: NFT) => +loot.name.substring(6) === lootId);
  };

  return (
    <>
      {NFT && <Modal open={open} setOpen={setOpen} targetDefender={NFT?.tokenId} userLOOT={userLOOT} slots={slots} />}

      <div className="row">
        <div className="col-4">{NFT && <CardWrapper NFT={NFT} />}</div>

        <div className="col-8">
          <div className="row h-100">
            <div className="row" style={{ height: 'fit-content' }}>
              {LOOT.map((loot, index) => {
                return (
                  <div key={`LOOT#${index}`} className="col-4" onClick={() => setOpen(index)}>
                    <div className="loot-wrapper shadow-sm">
                      {findLoot(slots[index]) >= 0 ? (
                        <CardWrapper NFT={userLOOT[findLoot(slots[index])]} isLoot disabledFlip />
                      ) : (
                        <FontAwesomeIcon icon={loot.icon} fontSize={75} color="#232628" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {findLoot(slots[0]) === -1 && findLoot(slots[1]) === -1 && findLoot(slots[2]) === -1 && (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-info w-100">Click on the above cards to equip items</div>
                </div>
              </div>
            )}
            <div className="row">
              <StakeSection account={account} NFT={NFT} slots={slots} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
