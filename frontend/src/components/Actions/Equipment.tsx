// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import { TransactionState, TransactionStatus } from '@usedapp/core';
import { STAKE_CONTRACT_ADDRESS } from 'dungeon-defenders-contracts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faCircleMinus, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

// *INTERNALS*
import { useEquip, useUnequip, useSlots, useApproveLoot, useAllowanceLoot, useAesthetics } from '../../hooks/index';
import { STATUS_TYPES } from '../../constants';
import LoadingBtn from '../LoadingBtn';
import { sendTx, handleTxStatus } from '../../utils';

type ActionProps = {
  tokenId: number | string;
  userAddress: string;
  onEquipmentUpdated?: (slots: number[]) => void;
};

type FormProps = {
  label?: string;
  value: number | string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
  disabled: boolean;
  children: React.ReactNode;
};

const LOOT_LIST = [
  {
    title: 'Weapon #',
    id: 0,
  },
  {
    title: 'Armor #',
    id: 1,
  },
  {
    title: 'Boots #',
    id: 2,
  },
];

const STATE_INDEX = {
  EQUIP: 0,
  UNEQUIP: 1,
  APPROVE: 2,
};

const FormUtil = ({ label, value, onChange, disabled, children }: FormProps) => {
  return (
    <div className="row">
      {label && <label htmlFor="gemsAmount">{label}</label>}
      <div className="form-group text-start">
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            placeholder="42"
            min={0}
            aria-label="Gems Amount"
            onChange={(e) => onChange(e.target.value)}
            value={value}
            disabled={disabled}
          />
          {children}
        </div>
      </div>
    </div>
  );
};

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
        {/* <div className="text-start mt-3 ms-1">Loot Equiped</div> */}
        <ul className="list-group text-start mt-3">
          {/* <li className="list-group-item">
            <div className="row align-items-center">
              <div className="col-4">Item ID</div>
              <div className="col-8">Loot ID</div>
            </div>
          </li> */}
          {LOOT_LIST.map((loot) => {
            const { title, id } = loot;
            return (
              <li key={loot.title} className="list-group-item">
                <div className="row align-items-center">
                  <div className="col-4">
                    <b>
                      {title}
                      {/* {aesthetics[id]} */}
                    </b>
                  </div>
                  <div className="col-8">
                    <FormUtil
                      value={loots[id]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetLoot(e, id)}
                      disabled={slots[id] !== 0}
                    >
                      {isPending[STATE_INDEX.EQUIP] || isPending[STATE_INDEX.UNEQUIP] ? (
                        <LoadingBtn type="primary" width="110px" />
                      ) : slots[id] === 0 ? (
                        <button
                          onClick={() => sendTx(() => equip(loots[id]))}
                          className="btn btn-lg btn-primary small-btn"
                        >
                          <FontAwesomeIcon className="fa-icon fa-white" icon={faPlus} fontSize={22} />
                        </button>
                      ) : (
                        <button
                          onClick={() => sendTx(() => unequip(loots[id]))}
                          className="btn btn-lg btn-secondary small-btn"
                        >
                          <FontAwesomeIcon className="fa-icon fa-white" icon={faMinus} fontSize={22} />
                        </button>
                      )}
                    </FormUtil>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

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
