// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./DungeonDefenders/DefenderInterface.sol";
import "./Loot/LootInterface.sol";

contract Staking is IERC721Receiver, Ownable {
    // TODO natspec
    DefenderInterface public characterToken;
    LootInterface public lootToken;
    IERC20 public gemsToken;
    uint256 public STAKING_FEE = 100 * 10**18;

    struct Stake {
        uint256 tokenId;
        uint256 weaponId;
        uint256 armorId;
        uint256 bootsId;
        uint256 gemsAmount;
        uint256 rewardedExpAmount;
        uint256 rewardedGemsAmount;
        uint256 timestamp;
        bool wasRewardLoot;
        bool isClaimable;
        bool isInitialized;
    }

    event NFTStaked(
        address owner,
        uint256 defenderId,
        uint256 weaponId,
        uint256 armorId,
        uint256 bootsId,
        uint256 gemsAmount
    );
    event NFTUnstaked(
        address owner,
        uint256 defenderId,
        uint256 weaponId,
        uint256 armorId,
        uint256 bootsId,
        uint256 rewardedAmount,
        uint256 rewardedExp,
        bool wasRewardLoot
    );
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

    constructor(
        DefenderInterface _characterToken,
        LootInterface _lootToken,
        IERC20 _gemsToken
    ) {
        characterToken = _characterToken;
        lootToken = _lootToken;
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
    function stake(
        uint256 _defenderId,
        uint256 _weaponId,
        uint256 _armorId,
        uint256 _bootsId,
        uint256 gemsAmount
    ) external onlyOneStake minimumAmount(gemsAmount) {
        require(
            characterToken.ownerOf(_defenderId) == msg.sender,
            "Must own defender"
        );
        require(
            _weaponId == 0 || lootToken.ownerOf(_weaponId) == msg.sender,
            "Must own weapon"
        );
        require(
            _armorId == 0 || lootToken.ownerOf(_armorId) == msg.sender,
            "Must own armor"
        );
        require(
            _bootsId == 0 || lootToken.ownerOf(_bootsId) == msg.sender,
            "Must own boots"
        );

        stakes[msg.sender] = Stake(
            _defenderId,
            _weaponId,
            _armorId,
            _bootsId,
            gemsAmount,
            0,
            STAKING_FEE,
            block.timestamp,
            false,
            false,
            true
        );
        gemsToken.transferFrom(msg.sender, address(this), gemsAmount);
        characterToken.safeTransferFrom(msg.sender, address(this), _defenderId);
        if (_weaponId > 0) {
            lootToken.safeTransferFrom(msg.sender, address(this), _weaponId);
        }
        if (_armorId > 0) {
            lootToken.safeTransferFrom(msg.sender, address(this), _armorId);
        }
        if (_bootsId > 0) {
            lootToken.safeTransferFrom(msg.sender, address(this), _bootsId);
        }
        emit NFTStaked(
            msg.sender,
            _defenderId,
            _weaponId,
            _armorId,
            _bootsId,
            gemsAmount
        );
    }

    // Pure unstaking logic
    function _unstake() internal {
        uint256 rewardedAmount = stakes[msg.sender].rewardedGemsAmount;
        uint256 rewardedExp = stakes[msg.sender].rewardedExpAmount;
        bool wasRewardLoot = stakes[msg.sender].wasRewardLoot;
        uint256 tokenId = stakes[msg.sender].tokenId;
        uint256 weaponId = stakes[msg.sender].weaponId;
        uint256 armorId = stakes[msg.sender].armorId;
        uint256 bootsId = stakes[msg.sender].bootsId;
        delete stakes[msg.sender];

        gemsToken.transfer(msg.sender, rewardedAmount);
        if (rewardedExp > 0) {
            characterToken.gainExperience(tokenId, rewardedExp);
        }
        characterToken.updateWinTracker(tokenId, true);
        characterToken.safeTransferFrom(address(this), msg.sender, tokenId);
        if (weaponId > 0) {
            lootToken.safeTransferFrom(address(this), msg.sender, weaponId);
        }
        if (armorId > 0) {
            lootToken.safeTransferFrom(address(this), msg.sender, armorId);
        }
        if (bootsId > 0) {
            lootToken.safeTransferFrom(address(this), msg.sender, bootsId);
        }
        if (wasRewardLoot) {
            lootToken.safeMint(msg.sender, "");
        }

        emit NFTUnstaked(
            msg.sender,
            tokenId,
            weaponId,
            armorId,
            bootsId,
            rewardedAmount,
            rewardedExp,
            wasRewardLoot
        );
    }

    // Might need reentrancy guard here too
    function unstake() external {
        require(
            stakes[msg.sender].isClaimable,
            "Not claimable: You need to wait for the game to end"
        );
        _unstake();
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
        _unstake();
    }

    // Close the game and allocate rewards
    function allocateRewards(
        uint256 gemsAmount,
        uint256 expAmount,
        address player,
        bool shouldRewardLoot
    ) external onlyOwner {
        require(
            isStaking(player),
            "Not staking: player needs to stake before allocating rewards"
        );
        require(
            stakes[player].isClaimable == false,
            "Claimable: Already allocated rewards"
        );
        stakes[player].isClaimable = true;
        stakes[player].rewardedGemsAmount = gemsAmount;
        stakes[player].rewardedExpAmount = expAmount;
        stakes[player].wasRewardLoot = shouldRewardLoot;
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
