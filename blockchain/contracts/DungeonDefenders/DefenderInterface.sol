// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface DefenderInterface is IERC721 {
    function gainExperience(uint256 _tokenId, uint256 _expToGain) external;
}
