// *EXTERNALS*
import React, { memo } from 'react';
import useSWR from 'swr';

// *INTERNALS*
import { NFT } from '../../types';
import { API_ADDRESS } from '../../constants';
import NFTCard from './NFTCard';
import SmallNFTCard from './SmallNFTCard';

interface Props {
  NFT: NFT;
  isLoot?: boolean;
  isSmall?: boolean;
  disabledFlip?: boolean;
}

const fetcher = (params: any) => fetch(params).then(async (res) => URL.createObjectURL(await res.blob()));

const CardWrapper = ({ NFT, isLoot, isSmall, disabledFlip }: Props) => {
  const { name, tokenId } = NFT;
  const actualTokenId = tokenId || +name.replace(/^\D+/g, ''); // Trick to bypass the issue of tokenId not being set in the NFT object
  const toFetch = isLoot
    ? `${API_ADDRESS}/v1/loot/${actualTokenId}/render`
    : `${API_ADDRESS}/v1/nft/${actualTokenId}/render`;
  const { data: image, error } = useSWR(toFetch, fetcher);

  return image ? (
    isSmall ? (
      <SmallNFTCard NFT={NFT} renderedImage={image} disabledFlip={disabledFlip} />
    ) : (
      <NFTCard NFT={NFT} tokenId={actualTokenId} isLoot={isLoot} renderedImage={image} />
    )
  ) : (
    <div className="text-center mt-5">
      <span className="spinner-border spinner-border-sm text-main" role="status" aria-hidden="true"></span>
    </div>
  );
};

export default memo(CardWrapper);
