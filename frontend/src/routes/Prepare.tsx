// *EXTERNALS*
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEthers, TransactionState, TransactionStatus } from '@usedapp/core';
import { Buffer } from 'buffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faShoePrints, faGun, faCircleMinus, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import styled from 'styled-components';

// *INTERNALS*
import { API_ADDRESS, STATUS_TYPES } from '../constants';
import { useEquip, useUnequip, useTokenURI, useOwnerOf, useSlots } from '../hooks/index';
import { sendTx, handleTxStatus } from '../utils';
import CardWrapper from '../components/Card/CardWrapper';
import type { NFT } from '../types';

const Wrapper = styled.div<any>`
  border: 1px solid transparent;
  position: relative;
  cursor: pointer;
  &:hover {
    border-color: ${({ isEquiped }) => (isEquiped ? '#ff5959' : '#2cb978')};
  }
`;

const FloatWrapper = styled.div<any>`
  position: absolute;
  z-index: 1;
  right: ${({ right }) => right};
  top: ${({ top }) => top};
`;

const fetcher = (params: any) => fetch(params).then((res) => res.json());

export default function Prepare() {
  const params = useParams();
  const { state: equipState, send: sendEquip } = useEquip();
  const { state: unequipState, send: sendUnequip } = useUnequip();
  const { nftId } = params;
  const { account } = useEthers();
  const [open, setOpen] = useState<number | null>(null);
  const slots = useSlots(nftId);
  const URI = useTokenURI(nftId || 0);
  const owner = useOwnerOf(nftId || 0);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;
  const { data: userLOOT, error } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${owner}`, fetcher);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([equipState, unequipState]);
  const STATUS = STATES.map((state) => state.status as string);
  //   const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    setSTATES([equipState, unequipState]);
  }, [equipState, unequipState]);

  useEffect(() => {
    handleTxStatus(STATES, STATUS, handleStateChange, () => setOpen(null));
  }, [STATES]);

  const findLoot = (lootId: number) => {
    if (!userLOOT) return -1;
    return userLOOT.findIndex((loot: NFT) => +loot.name.substring(6) === lootId);
  };

  const handleLootClick = (lootId: number) => {
    setOpen(lootId);
  };

  const equipLoot = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, name: string) => {
    e.stopPropagation();
    const lootId = +name.substring(6);
    sendTx(() => sendEquip(nftId, lootId));
  };

  const unequipLoot = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, name: string) => {
    e.stopPropagation();
    const lootId = +name.substring(6);
    sendTx(() => sendUnequip(nftId, lootId));
  };

  // TODO
  /*
    pointer + hover/select loot
    more intuitive UI 
  */

  const checkLootType = (loot: NFT) => {
    // Not proud of this one, there has to be a cleaner way but im tired
    const weapon = loot.attributes[7].value;
    const armor = loot.attributes[8].value;
    const boots = loot.attributes[9].value;
    if (weapon) return 0;
    if (armor) return 1;
    if (boots) return 2;
    return null;
  };

  return (
    <>
      {open != null ? (
        <div className="prepare-modal" onClick={() => setOpen(null)}>
          <FloatWrapper className="whatever" top="10px" right="20px">
            <FontAwesomeIcon
              icon={faXmark}
              fontSize={30}
              color="#ff5959"
              className="mr-3"
              onClick={() => setOpen(null)}
              style={{ cursor: 'pointer' }}
            />
          </FloatWrapper>
          <div className="row">
            {userLOOT &&
              userLOOT
                .filter((item: NFT) => open === checkLootType(item))
                .map((NFT: NFT) => (
                  <div
                    key={NFT.name}
                    className="col-3"
                    onClick={(e) =>
                      slots[open] === +NFT.name.substring(6) ? unequipLoot(e, NFT.name) : equipLoot(e, NFT.name)
                    }
                  >
                    <Wrapper className="modal-loot-wrapper" isEquiped={slots[open] === +NFT.name.substring(6)}>
                      <FloatWrapper className="float-wrapper" top="10px" right="10px">
                        {slots[open] === +NFT.name.substring(6) ? (
                          <FontAwesomeIcon icon={faCircleMinus} fontSize={20} color="#ff5959" />
                        ) : (
                          <FontAwesomeIcon icon={faCirclePlus} fontSize={20} color="#2cb978" />
                        )}
                      </FloatWrapper>
                      <CardWrapper NFT={NFT} owner={owner} isLoot isSmall />
                    </Wrapper>
                  </div>
                ))}
          </div>
        </div>
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
                  <div className="col-5 loot-wrapper" onClick={() => handleLootClick(0)}>
                    {findLoot(slots[0]) >= 0 ? (
                      <CardWrapper NFT={userLOOT[findLoot(slots[0])]} owner={owner} isLoot isSmall />
                    ) : (
                      <FontAwesomeIcon icon={faGun} fontSize={75} color="#232628" />
                    )}
                  </div>

                  <div className="col-5 offset-1 loot-wrapper" onClick={() => handleLootClick(1)}>
                    {findLoot(slots[1]) >= 0 ? (
                      <CardWrapper NFT={userLOOT[findLoot(slots[1])]} owner={owner} isLoot isSmall />
                    ) : (
                      <FontAwesomeIcon icon={faShirt} fontSize={75} color="#232628" />
                    )}
                  </div>

                  {/* <div className="col-5 loot-wrapper p-0">
                    <button className="btn btn-primary btn-large">Play</button>
                  </div> */}

                  <div className="col-5 loot-wrapper" onClick={() => handleLootClick(2)}>
                    {findLoot(slots[2]) >= 0 ? (
                      <CardWrapper NFT={userLOOT[findLoot(slots[2])]} owner={owner} isLoot isSmall />
                    ) : (
                      <FontAwesomeIcon icon={faShoePrints} fontSize={75} color="#232628" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
