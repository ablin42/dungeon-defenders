// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is IERC721Receiver {
    IERC721 public nft;

    struct Stake {
        uint256 tokenId;
        uint256 amount;
        uint256 timestamp;
    }

    event NFTStaked(address owner, uint256 tokenId, uint256 value);
    event NFTUnstaked(address owner, uint256 tokenId, uint256 value);
    event Claimed(address owner, uint256 amount);

    // map staker address to stake details
    mapping(address => Stake) public stakes;

    // map staker total staking time
    mapping(address => uint256) public stakingTime;

    constructor(IERC721 _nft) {
        nft = _nft;
    }

    function stake(uint256 _tokenId, uint256 _amount) external {
        stakes[msg.sender] = Stake(_tokenId, _amount, block.timestamp);
        nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit NFTStaked(msg.sender, _tokenId, _amount);
    }

    function unstake() external {
        nft.safeTransferFrom(
            address(this),
            msg.sender,
            stakes[msg.sender].tokenId
        );
        stakingTime[msg.sender] += (block.timestamp -
            stakes[msg.sender].timestamp);
        emit NFTUnstaked(
            msg.sender,
            stakes[msg.sender].tokenId,
            stakes[msg.sender].amount
        );
        delete stakes[msg.sender];
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
}
