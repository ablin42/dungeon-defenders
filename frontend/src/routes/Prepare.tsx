// *EXTERNALS*
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { Buffer } from 'buffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faShoePrints, faGun } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import styled from 'styled-components';

// *INTERNALS*
import { API_ADDRESS } from '../constants';
import { useEquip, useTokenURI, useOwnerOf, useSlots } from '../hooks/index';
import CardWrapper from '../components/CardWrapper';
import type { NFT } from '../types';

const LootWrapper = styled.div`
  background-color: #101010;
  display: flex;
  padding: 10px;
  height: fit-content;
  min-height: 350px;
  margin-bottom: 25px;
  cursor: pointer;
`;

const Modal = styled.div`
  background-color: #0c0c0c;
  position: absolute;
  padding: 20px 40px;
  top: 50%;
  left: 50%;
  width: 75%;
  height: 90%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function Prepare() {
  const params = useParams();
  const { state: equipState, send: sendEquip } = useEquip();
  const { nftId } = params;
  const { account } = useEthers();
  const [open, setOpen] = useState<number | null>(null);
  const slots = useSlots(nftId);
  const [equipedLoot, setEquipedLoot] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);
  const URI = useTokenURI(nftId || 0);
  const owner = useOwnerOf(nftId || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;
  const { data: userLOOT, error } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${owner}`, fetcher);

  useEffect(() => {
    if (slots && slots !== equipedLoot) setEquipedLoot(slots);
  }, [slots.toString()]);

  const findLoot = (lootId: number) => {
    if (!userLOOT) return -1;
    const index = userLOOT.findIndex((loot: NFT) => +loot.name.substring(6) === lootId);
    return index;
  };

  const handleLootClick = (lootId: number) => {
    setOpen(lootId);
  };

  const selectLoot = (e: any, name: string) => {
    e.stopPropagation();
    const lootId = +name.substring(6);
    console.log('selecting loot:', nftId, lootId);
    sendEquip(nftId, lootId);
    // const index = findLoot(open);
    // if (index === -1) return;
    // const newEquipedLoot = [...equipedLoot];
    // newEquipedLoot[0] = userLOOT[index].name;
    // setEquipedLoot(newEquipedLoot);
    // setOpen(null);
  };

  return (
    <>
      {open != null ? (
        <Modal onClick={() => setOpen(null)}>
          <div className="row">
            {userLOOT &&
              userLOOT.map((NFT: NFT) => (
                <div key={NFT.name} className="col-3" onClick={(e) => selectLoot(e, NFT.name)}>
                  <CardWrapper NFT={NFT} owner={owner} isLoot isSmall />
                </div>
              ))}
          </div>
        </Modal>
      ) : null}
      {owner && account && owner !== account ? (
        <div className="text-center mt-4 mb-5">
          <div className="container" style={{ minHeight: '600px' }}>
            <div className="container-decorated">
              <div className="col-8 offset-2">{NFTObject && <CardWrapper NFT={NFTObject} owner={owner} />}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4 mb-5">
          <div className="container" style={{ minHeight: '600px' }}>
            <div className="container-decorated">
              <div className="row">
                <div className="col-4">{NFTObject && <CardWrapper NFT={NFTObject} owner={owner} />}</div>
                <div className="row col-7 offset-1">
                  <LootWrapper className="col-5" onClick={() => handleLootClick(0)}>
                    {findLoot(slots[0]) >= 0 ? (
                      <CardWrapper NFT={userLOOT[findLoot(slots[0])]} owner={owner} isLoot />
                    ) : (
                      <FontAwesomeIcon className="fa-icon fa-white" icon={faGun} fontSize={45} />
                    )}
                  </LootWrapper>

                  <LootWrapper className="col-5 offset-1" onClick={() => handleLootClick(1)}>
                    {findLoot(slots[1]) >= 0 ? (
                      <CardWrapper NFT={userLOOT[findLoot(slots[1])]} owner={owner} isLoot />
                    ) : (
                      <FontAwesomeIcon className="fa-icon fa-white" icon={faShirt} fontSize={45} />
                    )}
                  </LootWrapper>

                  <LootWrapper className="col-5" onClick={() => handleLootClick(2)}>
                    {findLoot(slots[2]) >= 0 ? (
                      <CardWrapper NFT={userLOOT[findLoot(slots[2])]} owner={owner} isLoot />
                    ) : (
                      <FontAwesomeIcon className="fa-icon fa-white" icon={faShoePrints} fontSize={45} />
                    )}
                  </LootWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
