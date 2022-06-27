// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is IERC721Receiver, Ownable {
    // TODO natspec
    IERC721 public characterToken;
    IERC20 public gemsToken;
    uint256 public STAKING_FEE = 100 * 10**18;

    struct Stake {
        uint256 tokenId;
        uint256 gemsAmount;
        uint256 rewardedGemsAmount;
        uint256 timestamp;
        bool isClaimable;
        bool isInitialized;
    }

    event NFTStaked(address owner, uint256 tokenId, uint256 gemsAmount);
    event NFTUnstaked(address owner, uint256 tokenId, uint256 rewardedAmount);
    event Claimed(address owner);

    // Map staker address to stake details
    mapping(address => Stake) public stakes;

    // Allows only one NFT staked at a time per user
    modifier onlyOneStake() {
        require(
            !isStaking(msg.sender),
            "Already staking: Only one character per address can be staked at a time"
        );
        _;
    }

    modifier minimumAmount(uint256 gemsAmount) {
        require(
            gemsAmount >= STAKING_FEE && gemsBalance(msg.sender) >= gemsAmount,
            "Insufficient amount: You need to have at least 100 gems to stake"
        );
        _;
    }

    constructor(IERC721 _characterToken, IERC20 _gemsToken) {
        characterToken = _characterToken;
        gemsToken = _gemsToken;
    }

    function isStaking(address _staker) public view returns (bool) {
        return stakes[_staker].isInitialized;
    }

    // Useful for the contract to self check its gems balance
    function gemsBalance(address _staker) public view returns (uint256) {
        return gemsToken.balanceOf(_staker);
    }

    // Might need to implement a reentrancy guard here to avoid double staking
    function stake(uint256 _tokenId, uint256 gemsAmount)
        external
        onlyOneStake
        minimumAmount(gemsAmount)
    {
        stakes[msg.sender] = Stake(
            _tokenId,
            gemsAmount,
            0,
            block.timestamp,
            false,
            true
        );
        gemsToken.transferFrom(msg.sender, address(this), gemsAmount);
        characterToken.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit NFTStaked(msg.sender, _tokenId, gemsAmount);
    }

    // Might need reentrancy guard here too
    function unstake() external {
        require(
            stakes[msg.sender].isClaimable,
            "Not claimable: You need to wait for the game to end"
        );
        uint256 rewardedAmount = stakes[msg.sender].rewardedGemsAmount;
        uint256 tokenId = stakes[msg.sender].tokenId;
        delete stakes[msg.sender];

        gemsToken.transfer(msg.sender, rewardedAmount);
        characterToken.safeTransferFrom(address(this), msg.sender, tokenId);

        emit NFTUnstaked(msg.sender, tokenId, rewardedAmount);
    }

    // TODO later, set NFT loot rewards here
    // Close the game and allocate rewards
    function allocateRewards(uint256 gemsAmount, address player)
        external
        onlyOwner
    {
        require(
            isStaking(player),
            "Not staking: player needs to stake before allocating rewards"
        );
        stakes[player].isClaimable = true;
        stakes[player].rewardedGemsAmount = gemsAmount;
    }

    // Withdraw your funds after 30mn if the game didn't close due to an unexpected issue
    function emergencyWithdraw() external {
        require(
            stakes[msg.sender].isInitialized,
            "Not Initialized: You need to start a new game"
        );
        require(
            block.timestamp > stakes[msg.sender].timestamp + 30 minutes,
            "Too early: You can only withdraw after 30 minutes"
        );
        uint256 rewardedAmount = STAKING_FEE;
        uint256 tokenId = stakes[msg.sender].tokenId;
        delete stakes[msg.sender];

        gemsToken.transfer(msg.sender, rewardedAmount);
        characterToken.safeTransferFrom(address(this), msg.sender, tokenId);
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
