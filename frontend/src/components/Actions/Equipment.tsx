// *EXTERNALS*
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TransactionStatus } from '@usedapp/core';

// *INTERNALS*
import { useEquip, useUnequip, useSlots, useApproveLoot, useAllowanceLoot } from '../../hooks/index';
import { STATUS_TYPES, NETWORK_EXPLORER, STAKE_CONTRACT_ADDRESS } from '../../constants';
import LoadingBtn from '../LoadingBtn';
import { sendTx } from '../../utils';

type ActionProps = {
  tokenId: number | string;
  userAddress: string;
};

type FormProps = {
  label?: string;
  value: number | string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: Function;
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
  // *STATE*
  const [isPending, setIsPending] = useState(false);
  const [loots, setLoots] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([equipState, unequipState, approveState]);

  const handleStateChange = (STATUS: Array<TransactionStatus>, index: number) => {
    const newSTATES = JSON.parse(JSON.stringify(STATUS));
    newSTATES[index].status = STATUS_TYPES.NONE;
    setSTATES(newSTATES);
    setIsPending(false);
  };

  useEffect(() => {
    if (slots !== loots) setLoots(slots);
  }, [slots.toString()]);

  useEffect(() => {
    setSTATES([equipState, unequipState, approveState]);
  }, [equipState, unequipState, approveState]);

  useEffect(() => {
    const STATUS = STATES.map((state) => state.status as string);
    setIsPending(STATUS.includes(STATUS_TYPES.PENDING) || STATUS.includes(STATUS_TYPES.MINING));

    if (STATUS.find((item) => item === STATUS_TYPES.SUCCESS)) {
      const successIndex = STATUS.findIndex((i) => i === STATUS_TYPES.SUCCESS);
      const targetedState = STATES[successIndex];
      handleStateChange(STATES, successIndex);

      toast.success(
        <>
          Tx Success:
          <a target="_blank" rel="noreferrer" href={`${NETWORK_EXPLORER}/tx/${targetedState.receipt?.transactionHash}`}>
            {targetedState.receipt?.transactionHash.substring(0, 12)}...
          </a>
        </>,
        {},
      );
    }
    if (STATUS.find((item) => item === STATUS_TYPES.EXCEPTION) || STATUS.find((item) => item === STATUS_TYPES.FAIL)) {
      const statusIndex = STATUS.findIndex((i) => i === STATUS_TYPES.EXCEPTION || i === STATUS_TYPES.FAIL);
      handleStateChange(STATES, statusIndex);

      toast.error(`Tx Error: ${STATES[statusIndex].errorMessage}`);
    }
  }, [STATES]);

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
        <div className="text-start mt-3 ms-1">Loot Equiped</div>
        <ul className="list-group text-start m-1">
          {LOOT_LIST.map((loot) => {
            const { title, id } = loot;
            return (
              <li key={loot.title} className="list-group-item">
                <div className="row" style={{ alignItems: 'center' }}>
                  <div className="col-4">
                    <b>
                      {title}
                      {slots[id]}
                    </b>
                  </div>
                  <div className="col-8">
                    <FormUtil
                      value={loots[id]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetLoot(e, id)}
                    >
                      {isPending ? (
                        <LoadingBtn type="primary" />
                      ) : slots[id] === 0 ? (
                        <button onClick={() => sendTx(() => equip(loots[id]))} className="btn btn-lg btn-primary">
                          Equip
                        </button>
                      ) : (
                        <button onClick={() => sendTx(() => unequip(loots[id]))} className="btn btn-lg btn-primary">
                          Unequip
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

  // To handle loading state
  if (isPending) return <>{!LOOTAllowance ? <LoadingBtn type="primary" /> : getLootList()}</>;

  return (
    <>
      {LOOTAllowance ? (
        getLootList()
      ) : (
        <button onClick={() => sendTx(approve)} className="btn btn-lg btn-primary mt-3">
          Approve LOOT
        </button>
      )}
    </>
  );
};

export default Equipment;
