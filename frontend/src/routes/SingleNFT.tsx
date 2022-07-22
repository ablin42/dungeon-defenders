// *EXTERNALS*
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEthers, TransactionState, TransactionStatus } from '@usedapp/core';
import { Buffer } from 'buffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShirt,
  faShoePrints,
  faGun,
  faCircleMinus,
  faCirclePlus,
  faXmark,
  faGem,
} from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import styled from 'styled-components';

// *INTERNALS*
import { API_ADDRESS, STATUS_TYPES } from '../constants';
import { useEquip, useUnequip, useTokenURI, useOwnerOf, useSlots, useGemsBalance, useStakes } from '../hooks/index';
import { sendTx, handleTxStatus } from '../utils';
import CardWrapper from '../components/Card/CardWrapper';
import type { NFT } from '../types';
import Play from '../components/Actions/Play';
import Error from '../components/Misc/Error';

const Wrapper = styled.div<any>`
  border: 1px solid transparent;
  border-radius: 5px;
  border-color: ${({ isEquiped }) => (isEquiped ? '#2d767f' : 'transparent')};
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

const ITEM_TYPE = ['Weapon', 'Armor', 'Boots'];

const fetcher = (params: any) => fetch(params).then((res) => res.json());

// TODO extract logic
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
  const stakes = account && useStakes(account);
  const NFTObject = URI ? JSON.parse(Buffer.from(URI, 'base64').toString()) : null;
  if (NFTObject) NFTObject.tokenId = nftId;
  const { data: userLOOT, error } = useSWR(`${API_ADDRESS}/v1/loot/wallet/${owner}`, fetcher);
  const [STATES, setSTATES] = useState<Array<TransactionStatus>>([equipState, unequipState]);
  const STATUS = STATES.map((state) => state.status as string);
  const gemsBalance = useGemsBalance(account) || 0;
  const [gemsAmount, setGemsAmount] = useState<number>(100);
  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;
  const isUserStakedToken = userStaking && nftId == stakedId;
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
      {!owner || !account || (owner !== account && !isUserStakedToken) ? (
        <div className="text-center mt-5">
          <div className="container container-decorated col-4" style={{ minHeight: '600px' }}>
            <div className="col-8 offset-2">{NFTObject && <CardWrapper NFT={NFTObject} />}</div>
          </div>
        </div>
      ) : (
        <>
          {open != null ? (
            <div className="overlay" onClick={() => setOpen(null)}>
              <div className="shadow-lg prepare-modal" onClick={(e) => e.stopPropagation()}>
                <FloatWrapper className="whatever" top="5px" right="15px">
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
          <div className="text-center mt-5">
            <div className="container" style={{ minHeight: '600px' }}>
              <div className="container-decorated">
                <div className="row">
                  <div className="col-4">{NFTObject && <CardWrapper NFT={NFTObject} />}</div>
                  <div className="col-8">
                    <div className="row">
                      <div className="col-4" onClick={() => handleLootClick(0)}>
                        <div className="loot-wrapper shadow-sm">
                          {findLoot(slots[0]) >= 0 ? (
                            <CardWrapper NFT={userLOOT[findLoot(slots[0])]} isLoot disabledFlip />
                          ) : (
                            <FontAwesomeIcon icon={faGun} fontSize={75} color="#232628" />
                          )}
                        </div>
                      </div>

                      <div className="col-4" onClick={() => handleLootClick(1)}>
                        <div className="loot-wrapper shadow-sm">
                          {findLoot(slots[1]) >= 0 ? (
                            <CardWrapper NFT={userLOOT[findLoot(slots[1])]} isLoot disabledFlip />
                          ) : (
                            <FontAwesomeIcon icon={faShirt} fontSize={75} color="#232628" />
                          )}
                        </div>
                      </div>

                      <div className="col-4" onClick={() => handleLootClick(2)}>
                        <div className="loot-wrapper shadow-sm">
                          {findLoot(slots[2]) >= 0 ? (
                            <CardWrapper NFT={userLOOT[findLoot(slots[2])]} isLoot disabledFlip />
                          ) : (
                            <FontAwesomeIcon icon={faShoePrints} fontSize={75} color="#232628" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-4 text-start staking-section">
                      <div className="alert alert-info w-100">
                        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                          <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </symbol>
                          <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                          </symbol>
                          <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                          </symbol>
                        </svg>
                        <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Info:">
                          <use xlinkHref="#info-fill" />
                        </svg>
                        Staking more <FontAwesomeIcon className="fa-icon fa-main" icon={faGem} fontSize={18} />{' '}
                        increases <b>difficulty</b> & <b>rewards</b>
                      </div>

                      <label htmlFor="customRange1" className="form-label">
                        <span className="lead">
                          Gems to Stake <b className="text-main">{gemsAmount}</b>{' '}
                        </span>
                        <FontAwesomeIcon className="fa-icon fa-main" icon={faGem} fontSize={20} />
                      </label>
                      <input
                        type="range"
                        className="w-100 mb-2"
                        id="customRange1"
                        step="10"
                        min="100"
                        max={+gemsBalance < 1000 ? gemsBalance : 1000}
                        onChange={(e) => setGemsAmount(+e.target.value)}
                        value={gemsAmount}
                      />

                      <Play
                        userAddress={account || ''}
                        tokenId={nftId || 0}
                        equipedLoot={slots}
                        gemsAmount={gemsAmount}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
