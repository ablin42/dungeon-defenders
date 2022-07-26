// *EXTERNALS*
import React, { useState, useEffect } from 'react';
import { TransactionState, TransactionStatus } from '@usedapp/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// *INTERNALS*
import { STATUS_TYPES } from '../../constants';
import { useEquip, useUnequip } from '../../hooks/index';
import { sendTx, handleTxStatus } from '../../utils';
import CardWrapper from '../Card/CardWrapper';
import type { NFT } from '../../types';
import Error from './Error';

const Wrapper = styled.div<{ isEquiped: boolean }>`
  border: 1px solid transparent;
  border-radius: 5px;
  border-color: ${({ isEquiped }) => (isEquiped ? '#2d767f' : 'transparent')};
  position: relative;
  cursor: pointer;
  &:hover {
    border-color: ${({ isEquiped }) => (isEquiped ? '#ff5959' : '#2cb978')};
  }
`;

const FloatWrapper = styled.div<{ top: string; right: string }>`
  position: absolute;
  z-index: 1;
  right: ${({ right }) => right};
  top: ${({ top }) => top};
`;

interface ModalProps {
  targetDefender: string | number;
  open: number | null;
  slots: Array<number>;
  userLOOT: Array<NFT>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setOpen: Function;
}

const ITEM_TYPE = ['Weapon', 'Armor', 'Boots'];

export default function Modal({ targetDefender, open, setOpen, slots, userLOOT }: ModalProps) {
  const { state: equipState, send: sendEquip } = useEquip();
  const { state: unequipState, send: sendUnequip } = useUnequip();
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([equipState, unequipState]);
  const STATUS = STATES.map((state) => state.status as string);
  // const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);

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

  const equipLoot = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, name: string) => {
    e.stopPropagation();
    const lootId = +name.substring(6);
    sendTx(() => sendEquip(targetDefender, lootId));
  };

  const unequipLoot = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, name: string) => {
    e.stopPropagation();
    const lootId = +name.substring(6);
    sendTx(() => sendUnequip(targetDefender, lootId));
  };

  enum LootType {
    None,
    Weapon,
    Armor,
    Boots,
  }

  function checkLootType(loot: NFT): LootType {
    for (let i = 0; i < 3; i++) {
      if (loot.attributes[i + 7].value) {
        return i as LootType;
      }
    }
    return LootType.None;
  }

  return (
    <>
      {open != null ? (
        <div className="overlay" onClick={() => setOpen(null)}>
          <div className="shadow-lg prepare-modal" onClick={(e) => e.stopPropagation()}>
            <FloatWrapper top="5px" right="15px">
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
              {userLOOT && userLOOT.filter((item: NFT) => open === checkLootType(item)).length > 0 ? (
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
                        <CardWrapper NFT={NFT} isLoot isSmall />
                      </Wrapper>
                    </div>
                  ))
              ) : (
                <Error title={`No ${ITEM_TYPE[open]} in your collection`} error="" url="" btnText="" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
