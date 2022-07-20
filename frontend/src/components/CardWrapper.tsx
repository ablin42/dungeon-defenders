// *EXTERNALS*
import React, { memo, useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import useSWR from 'swr';

// *INTERNALS*
import { useStakes, useSlots } from '../hooks';
import { NFT } from '../types';
import { API_ADDRESS } from '../constants';
import NFTCard from '../components/NFTCard';
import SmallNFTCard from '../components/SmallNFTCard';

interface Props {
  NFT: NFT;
  owner: string;
  isLoot?: boolean;
  isSmall?: boolean;
}

const fetcher = (params: any) => fetch(params).then(async (res) => URL.createObjectURL(await res.blob()));

const CardWrapper = ({ NFT, owner, isLoot, isSmall }: Props) => {
  const { name, tokenId } = NFT;
  const actualTokenId = tokenId || +name.replace(/^\D+/g, ''); // Trick to bypass the issue of tokenId not being set in the NFT object
  const toFetch = isLoot
    ? `${API_ADDRESS}/v1/loot/${actualTokenId}/render`
    : `${API_ADDRESS}/v1/nft/${actualTokenId}/render`;
  const { data: image, error } = useSWR(toFetch, fetcher);
  const { account } = useEthers();
  const stakes = account && useStakes(account);
  const slots = !isLoot && useSlots(actualTokenId);
  const [equipedLoot, setEquipedLoot] = useState(slots ? [slots[1], slots[2], slots[3]] : [0, 0, 0]);
  const userStaking = stakes && +stakes.timestamp > 0;
  const stakedId = stakes && +stakes.tokenId;
  const isOwner = account === owner;
  const isUserStakedToken = userStaking && actualTokenId == stakedId;

  useEffect(() => {
    if (slots && slots !== equipedLoot) setEquipedLoot(slots);
  }, [slots.toString()]);

  const onEquipmentUpdated = (updatedSlots: number[]) => {
    setEquipedLoot(updatedSlots);
  };

  return image ? (
    isSmall ? (
      <SmallNFTCard
        NFT={NFT}
        isOwner={isOwner}
        isUserStakedToken={isUserStakedToken}
        tokenId={actualTokenId}
        onEquipmentUpdated={onEquipmentUpdated}
        slots={slots}
        isLoot={isLoot}
        account={account}
        renderedImage={image}
      />
    ) : (
      <NFTCard
        NFT={NFT}
        isOwner={isOwner}
        isUserStakedToken={isUserStakedToken}
        tokenId={actualTokenId}
        onEquipmentUpdated={onEquipmentUpdated}
        slots={slots}
        isLoot={isLoot}
        account={account}
        renderedImage={image}
      />
    )
  ) : (
    <div className="text-center mt-5">
      <span className="spinner-border spinner-border-sm text-main" role="status" aria-hidden="true"></span>
    </div>
  );
};

export default memo(CardWrapper);
