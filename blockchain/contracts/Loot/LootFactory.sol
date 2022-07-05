// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../ContractUtils.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Loot Factory for DungeonDefenders
/// @author rkhadder & 0xharb
/// @notice Used by Loot.sol
contract LootFactory is ContractUtils {
    using Counters for Counters.Counter;

    event NewLootGenerated(uint256 lootId, bytes32 name);

    Counters.Counter private _tokenIdCounter;

    int8 INIT_ATTR_MIN = -10;
    int8 INIT_ATTR_MAX = 40;
    uint8 MAX_LEVEL = 10;
    uint8 NUM_OF_BACKGROUNDS = 3;
    uint8 NUM_OF_WEAPONS = 13;
    uint8 NUM_OF_ARMOR = 1;
    uint8 NUM_OF_BOOTS = 1;

    struct Loot {
        bytes32 name;
        // Attributes
        uint256 minLevelRequired;
        int8 health;
        int8 speed;
        int8 strength;
        int8 defense;
        // Aesthetics
        uint8 background;
        uint8 weapon;
        uint8 armor;
        uint8 boots;
    }

    Loot[] public loot;

    /// @notice Create an empty loot
    /// @dev Used for loot with ID#0
    /// @return The ID of the loot created
    function _createEmpty() internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        loot.push(Loot(0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
        _tokenIdCounter.increment();
        return tokenId;
    }

    /// @notice Create loot with randomly generated values
    /// @dev Called by createRandomLoot
    /// @dev TODO left here
    /// @param _name Name of the loot
    /// @return The ID of the loot created
    function _createLoot(bytes32 _name) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();

        loot.push(_createWeapon(_name, tokenId));

        // TODO; lootType is only rolling 0, 1, 2 for some reason
        // uint8 lootType = _generateRandomUintValueInBounds(_name, tokenId, "LOOT_TYPE", 0, 12);
        // if (lootType == 0) {
        //     loot.push(_createBackground(_name, tokenId));
        // } else if (lootType == 1) {
        //     loot.push(_createBoots(_name, tokenId));
        // } else if (lootType == 2) {
        //     loot.push(_createArmor(_name, tokenId));
        // } else {
        //     loot.push(_createWeapon(_name, tokenId));
        // }

        _tokenIdCounter.increment();
        emit NewLootGenerated(tokenId, _name);
        return tokenId;
    }

    /// @notice Generate a random background for the loot
    /// @dev Called by _createLoot
    /// @param _name Name of the loot being created
    /// @param tokenId ID of the loot being created
    /// @return Loot The current loot item
    function _createBackground(bytes32 _name, uint256 tokenId)
        private
        view
        returns (Loot memory)
    {
        return
            Loot(
                _name,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "MIN_LEVEL_REQUIRED",
                    0,
                    MAX_LEVEL
                ),
                0,
                0,
                0,
                0,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "BACKGROUND",
                    0,
                    NUM_OF_BACKGROUNDS
                ),
                0,
                0,
                0
            );
    }

    /// @notice Generate a random weapon for the loot
    /// @dev Called by _createLoot
    /// @param _name Name of the loot being created
    /// @param tokenId ID of the loot being created
    /// @return Loot The current loot item
    function _createWeapon(bytes32 _name, uint256 tokenId)
        private
        view
        returns (Loot memory)
    {
        return
            Loot(
                _name,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "MIN_LEVEL_REQUIRED",
                    0,
                    MAX_LEVEL
                ),
                0,
                0,
                _generateRandomIntValueInBounds(
                    _name,
                    tokenId,
                    "STRENGTH",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                0,
                0,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "WEAPON",
                    1,
                    NUM_OF_WEAPONS + 1
                ),
                0,
                0
            );
    }

    /// @notice Generate a random armor for the loot
    /// @dev Called by _createLoot
    /// @param _name Name of the loot being created
    /// @param tokenId ID of the loot being created
    /// @return Loot The current loot item
    function _createArmor(bytes32 _name, uint256 tokenId)
        private
        view
        returns (Loot memory)
    {
        return
            Loot(
                _name,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "MIN_LEVEL_REQUIRED",
                    0,
                    MAX_LEVEL
                ),
                _generateRandomIntValueInBounds(
                    _name,
                    tokenId,
                    "HEALTH",
                    0,
                    INIT_ATTR_MAX / 2
                ),
                0,
                0,
                _generateRandomIntValueInBounds(
                    _name,
                    tokenId,
                    "DEFENSE",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                0,
                0,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "ARMOR",
                    1,
                    NUM_OF_ARMOR + 1
                ),
                0
            );
    }

    /// @notice Generate random boots for the loot
    /// @dev Called by _createLoot
    /// @param _name Name of the loot being created
    /// @param tokenId ID of the loot being created
    /// @return Loot The current loot item
    function _createBoots(bytes32 _name, uint256 tokenId)
        private
        view
        returns (Loot memory)
    {
        return
            Loot(
                _name,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "MIN_LEVEL_REQUIRED",
                    0,
                    MAX_LEVEL
                ),
                _generateRandomIntValueInBounds(
                    _name,
                    tokenId,
                    "HEALTH",
                    0,
                    INIT_ATTR_MAX / 2
                ),
                _generateRandomIntValueInBounds(
                    _name,
                    tokenId,
                    "SPEED",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                0,
                0,
                0,
                0,
                0,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "BOOTS",
                    1,
                    NUM_OF_BOOTS + 1
                )
            );
    }

    /// @notice Calls _createLoot which handles the loot generation
    /// @dev Called when minting
    /// @param _name Name of the loot to create
    /// @return _tokenId ID of the created loot
    function createRandomLoot(bytes32 _name)
        internal
        returns (uint256 _tokenId)
    {
        _tokenId = _createLoot(_name);
    }
}
