// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is IERC721Receiver {
    IERC721 public characterToken;

    struct Stake {
        uint256 tokenId;
        uint256 timestamp;
    }

    event NFTStaked(address owner, uint256 tokenId);
    event NFTUnstaked(address owner, uint256 tokenId);
    event Claimed(address owner);

    // map staker address to stake details
    mapping(address => Stake) public stakes;

    // map staker total staking time

    modifier onlyOneStake(address _staker) {
        require(this.isStaking(_staker), "Only one stake is allowed at once");
        _;
    }

    constructor(IERC721 _characterToken) {
        characterToken = _characterToken;
    }

    function isStaking(address _staker) public view returns (bool) {
        return stakes[_staker].timestamp == 0;
    }

    function stake(uint256 _tokenId) external onlyOneStake(msg.sender) {
        stakes[msg.sender] = Stake(_tokenId, block.timestamp);
        characterToken.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit NFTStaked(msg.sender, _tokenId);
    }

    function unstake() external {
        characterToken.safeTransferFrom(
            address(this),
            msg.sender,
            stakes[msg.sender].tokenId
        );
        emit NFTUnstaked(msg.sender, stakes[msg.sender].tokenId);
        delete stakes[msg.sender];
    }

    // https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#IERC721Receiver
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
