/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import { useEquip, useUnequip, useSlots, useApproveLoot, useAllowanceLoot } from '../../hooks/index';
import { STATUS_TYPES, NETWORK_EXPLORER, STAKE_CONTRACT_ADDRESS } from '../../constants';
import toast from 'react-hot-toast';
import { TransactionStatus } from '@usedapp/core';
import LoadingBtn from '../LoadingBtn';

type ActionProps = {
  tokenId: number | string;
  userAddress: string;
};

type FormProps = {
  label?: string;
  value: number | string;
  onChange: Function;
  children: React.ReactNode;
};

const FormUtil = ({ label, value, onChange, children }: FormProps) => {
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
          />
          {children}
        </div>
      </div>
    </div>
  );
};

const Equipment: React.FC<ActionProps> = ({ userAddress, tokenId }) => {
  // *HOOKS*
  const { state: equipState, send: sendEquip } = useEquip();
  const { state: unequipState, send: sendUnequip } = useUnequip();
  const { state: approveState, send: sendApprove } = useApproveLoot();
  const LOOTAllowance = useAllowanceLoot(userAddress);
  const slots = useSlots(tokenId);
  const [loots, setLoots] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);

  // *STATE*
  const [isPending, setIsPending] = useState(false);
  const [STATUS, setSTATUS] = useState<Array<string>>([equipState.status, unequipState.status, approveState.status]);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([equipState, unequipState, approveState]);
  // TODO can be refactored to avoid having STATES & STATUS

  useEffect(() => {
    if (slots !== loots) setLoots(slots);
  }, [slots.toString()]);

  useEffect(() => {
    const newSTATES = [equipState, unequipState, approveState];
    const newSTATUS = [equipState.status, unequipState.status, approveState.status];
    setSTATUS(newSTATUS);
    setSTATES(newSTATES);
  }, [equipState, unequipState, approveState]);

  useEffect(() => {
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const targetedState = STATES[successIndex];
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[successIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);

      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
            {targetedState.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
        {
          icon: '✅',
          position: 'top-right',
        },
      );
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
      const newSTATUS = JSON.parse(JSON.stringify(STATUS));
      newSTATUS[statusIndex] = STATUS_TYPES.NONE;
      setSTATUS(newSTATUS);
      setIsPending(false);

      toast.error(`Tx Error: ${STATES[statusIndex].errorMessage}`, {
        icon: '❌',
        position: 'top-right',
      });
    }
  }, [STATUS]);

  const handleSetLoot = (value: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newLoot = JSON.parse(JSON.stringify(loots));
    console.log(value);
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

  const sendTx = async (tx: Function) => {
    toast(`Tx Pending...`, {
      icon: '⏳',
      position: 'top-right',
    });
    tx();
  };

  const getLootList = () => {
    return (
      <>
        <div className="text-start">Loot Equiped</div>
        <ul className="list-group text-start">
          <li className="list-group-item">
            <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-4">
                <b>Weapon #{slots[0]}</b>
              </div>
              <div className="col-8">
                <FormUtil value={loots[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetLoot(e, 0)}>
                  {isPending ? (
                    <LoadingBtn type="primary" />
                  ) : slots[0] === 0 ? (
                    <button onClick={() => sendTx(() => equip(loots[0]))} className="btn btn-lg btn-primary">
                      Equip
                    </button>
                  ) : (
                    <button onClick={() => sendTx(() => unequip(loots[0]))} className="btn btn-lg btn-primary">
                      Unequip
                    </button>
                  )}
                </FormUtil>
              </div>
            </div>
          </li>
          <li className="list-group-item">
            <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-4">
                <b>Armor #{slots[1]}</b>
              </div>
              <div className="col-8">
                <FormUtil value={loots[1]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetLoot(e, 1)}>
                  {isPending ? (
                    <LoadingBtn type="primary" />
                  ) : slots[1] === 0 ? (
                    <button onClick={() => sendTx(() => equip(loots[1]))} className="btn btn-lg btn-primary">
                      Equip
                    </button>
                  ) : (
                    <button onClick={() => sendTx(() => unequip(loots[1]))} className="btn btn-lg btn-primary">
                      Unequip
                    </button>
                  )}
                </FormUtil>
              </div>
            </div>
          </li>
          <li className="list-group-item">
            <div className="row" style={{ alignItems: 'center' }}>
              <div className="col-4">
                <b>Boots #{slots[2]}</b>
              </div>
              <div className="col-8">
                <FormUtil value={loots[2]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetLoot(e, 2)}>
                  {isPending ? (
                    <LoadingBtn type="primary" />
                  ) : slots[2] === 0 ? (
                    <button onClick={() => sendTx(() => equip(loots[2]))} className="btn btn-lg btn-primary">
                      Equip
                    </button>
                  ) : (
                    <button onClick={() => sendTx(() => unequip(loots[2]))} className="btn btn-lg btn-primary">
                      Unequip
                    </button>
                  )}
                </FormUtil>
              </div>
            </div>
          </li>
        </ul>
      </>
    );
  };

  // To handle loading state
  if (isPending) return <>{!LOOTAllowance ? <LoadingBtn type="primary" /> : getLootList()}</>;

  return (
    <>
      {getLootList()}
      {!LOOTAllowance && (
        <button onClick={() => sendTx(approve)} className="btn btn-lg btn-primary">
          Approve LOOT
        </button>
      )}
    </>
  );
};

export default Equipment;
