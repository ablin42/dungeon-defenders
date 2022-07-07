// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./DungeonDefenders/DefenderInterface.sol";
import "./Loot/LootInterface.sol";

/// @title Staking Contract for DungeonDefenders
/// @author rkhadder & 0xharb
/// @notice Requires Gems (ERC20), LOOT (ERC721), and Defender (ERC721) to be deployed
contract Staking is IERC721Receiver, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
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
        // Grant the OPERATOR role to a specified account (here deployer)
        _setupRole(OPERATOR_ROLE, msg.sender);
        // Grant the ADMIN role to deployer (shouldnt be the same as OPERATOR)
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        characterToken = _characterToken;
        lootToken = _lootToken;
        gemsToken = _gemsToken;
    }

    /// @notice Check if _staker is staking
    /// @param _staker The address of the staker
    /// @return true if staking for this address has been initialized
    function isStaking(address _staker) public view returns (bool) {
        return stakes[_staker].isInitialized;
    }

    /// @notice Check Gems balance for _staker
    /// @dev Useful for the contract to self check balance
    /// @param _staker The address of the staker
    /// @return Gems balance for _staker
    function gemsBalance(address _staker) public view returns (uint256) {
        return gemsToken.balanceOf(_staker);
    }

    /// @notice Stake your Defender + Loot + Gems
    /// @notice You must have at least 100 gems to stake
    /// @notice One defender staked at a time per address
    /// @param _defenderId Defender to use
    /// @param _weaponId lootId to use for the weapon
    /// @param _armorId lootId to use for the armor
    /// @param _bootsId lootId to use for the boots
    /// @param gemsAmount Amount of gems paid for staking
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

    /// @notice Untake your Defender + Loot + Gems
    /// @dev Internal function to handle pure unstaking logic
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

    /// @notice Unstake your Defender + Loot + Gems
    /// @notice Must be claimable
    /// @dev Requires allocateRewards to be called first
    function unstake() external {
        require(
            stakes[msg.sender].isClaimable,
            "Not claimable: You need to wait for the game to end"
        );
        _unstake();
    }

    /// @notice Unstake your Defender + Loot + Gems
    /// @notice Must be initialized
    /// @notice Must be minimum 30 minutes after staking
    /// @notice Does not grant rewards
    /// @dev Withdraw function if allocateRewards failed to be called by OPERATOR
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

    /// @notice Allocated Rewards for a staker
    /// @notice Caller must have the OPERATOR role
    /// @dev Called by the server
    /// @param gemsAmount Gems amount to be rewarded
    /// @param expAmount Experience amount to grant to the defender
    /// @param player Staker address
    /// @param shouldRewardLoot Mints loot on unstaking if true
    function allocateRewards(
        uint256 gemsAmount,
        uint256 expAmount,
        address player,
        bool shouldRewardLoot
    ) external onlyRole(OPERATOR_ROLE) {
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

    /// @notice https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#IERC721Receiver
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return
            bytes4(
                keccak256("onERC721Received(address,address,uint256,bytes)")
            );
    }
}
