// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { TransactionState, TransactionStatus } from '@usedapp/core';
import { STAKE_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGun, faShirt, faShoePrints } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import useSWR from 'swr';

// *INTERNALS*
import { useEquip, useUnequip, useSlots, useApproveLoot, useAllowanceLoot, useAesthetics } from '../../hooks/index';
import { API_ADDRESS, STATUS_TYPES } from '../../constants';
import LoadingBtn from '../Misc/LoadingBtn';
import { sendTx, handleTxStatus } from '../../utils';
import CardWrapper from '../Card/CardWrapper';

const LootWrapper = styled.div`
  background-color: #101010;
  display: flex;
  padding: 0;
  height: 100%;
  margin: 0 5px;
  justify-content: center;
  align-items: center;
`;

type ActionProps = {
  tokenId: number | string;
  userAddress: string;
  onEquipmentUpdated?: (slots: number[]) => void;
};

const STATE_INDEX = {
  EQUIP: 0,
  UNEQUIP: 1,
  APPROVE: 2,
};

const fetcher = (params: any) => fetch(params).then((res) => res.json());

const Equipment: React.FC<ActionProps> = ({ userAddress, tokenId, onEquipmentUpdated }) => {
  // *HOOKS*
  const { state: equipState, send: sendEquip } = useEquip();
  const { state: unequipState, send: sendUnequip } = useUnequip();
  const { state: approveState, send: sendApprove } = useApproveLoot();
  const LOOTAllowance = useAllowanceLoot(userAddress);
  const slots = useSlots(tokenId);
  const aesthetics = useAesthetics(tokenId);
  // *STATE*
  const [loots, setLoots] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([equipState, unequipState, approveState]);
  const STATUS = STATES.map((state) => state.status as string);
  const isPending = STATUS.map((status) => status === STATUS_TYPES.PENDING || status === STATUS_TYPES.MINING);
  const { data: userLOOT, error } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${userAddress}`, fetcher);

  const handleStateChange = (STATES: Array<TransactionStatus>, index: number) => {
    const newSTATES = [...STATES] as [TransactionStatus];
    newSTATES[index].status = STATUS_TYPES.NONE as TransactionState;
    setSTATES(newSTATES);
  };

  useEffect(() => {
    if (slots !== loots) setLoots(slots);
  }, [slots.toString()]);

  useEffect(() => {
    setSTATES([equipState, unequipState, approveState]);
  }, [equipState, unequipState, approveState]);

  useEffect(() => {
    handleTxStatus(STATES, STATUS, handleStateChange);
  }, [STATES]);

  useEffect(() => {
    if (onEquipmentUpdated) {
      onEquipmentUpdated(loots);
    }
  }, [loots]);

  const handleSetLoot = (value: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newLoot = JSON.parse(JSON.stringify(loots));
    newLoot[index] = +value;
    setLoots(newLoot);
  };

  const findLoot = (lootId: number) => {
    if (!userLOOT) return -1;
    return userLOOT.findIndex((loot: any) => +loot.name.substring(6) === lootId);
  };

  const approve = async () => {
    sendApprove(STAKE_CONTRACT_ADDRESS, true);
  };
  const equip = async (targetLoot: number) => {
    sendEquip(tokenId, targetLoot);
  };
  const unequip = async (targetLoot: number) => {
    sendUnequip(tokenId, targetLoot);
  };

  const getLootList = () => {
    return (
      <>
        <div className="d-flex mt-3">
          <div className="col-4">
            <LootWrapper>
              {loots[0] > 0 ? (
                <CardWrapper NFT={userLOOT[findLoot(slots[0])]} owner={userAddress} isLoot isSmall disabledFlip />
              ) : (
                <FontAwesomeIcon icon={faGun} fontSize={75} color="#232628" />
              )}
            </LootWrapper>
          </div>
          <div className="col-4">
            <LootWrapper>
              {loots[1] > 0 ? (
                <CardWrapper NFT={userLOOT[findLoot(slots[1])]} owner={userAddress} isLoot isSmall />
              ) : (
                <FontAwesomeIcon icon={faShirt} fontSize={75} color="#232628" />
              )}
            </LootWrapper>
          </div>
          <div className="col-4">
            <LootWrapper>
              {loots[2] > 0 ? (
                <CardWrapper NFT={userLOOT[findLoot(slots[2])]} owner={userAddress} isLoot isSmall />
              ) : (
                <FontAwesomeIcon icon={faShoePrints} fontSize={75} color="#232628" />
              )}
            </LootWrapper>
          </div>
        </div>
      </>
    );
  };

  // TODO "Approve loot"
  return (
    <>
      {LOOTAllowance ? (
        getLootList()
      ) : isPending[STATE_INDEX.APPROVE] ? (
        <LoadingBtn type="primary" width="100%" />
      ) : (
        <button onClick={() => sendTx(approve)} className="btn btn-lg btn-primary w-100">
          Approve LOOT
        </button>
      )}
    </>
  );
};

export default Equipment;
