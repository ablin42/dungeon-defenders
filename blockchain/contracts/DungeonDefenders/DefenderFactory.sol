// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../ContractUtils.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Defender Factory for DungeonDefenders
/// @author rkhadder & 0xharb
/// @notice Used by DefenderUtils.sol
contract DefenderFactory is ContractUtils {
    using Counters for Counters.Counter;

    event NewDefenderGenerated(uint256 defenderId, bytes32 name);

    Counters.Counter private _tokenIdCounter;

    uint8 INIT_ATTR_MIN = 40;
    uint8 INIT_ATTR_MAX = 100;
    uint8 NUM_OF_CHARACTER_TYPES = 6;
    struct Defender {
        bytes32 name;
        // Attributes
        uint8 level;
        uint8 characterType;
        uint8 health;
        uint8 speed;
        uint8 strength;
        uint8 defense;
        // Stats
        uint8 dungeonWins;
        uint8 dungeonLosses;
    }

    uint8 AES_BACKGROUND_IDX = 0;
    uint8 AES_WEAPON_IDX = 1;
    uint8 AES_ARMOR_IDX = 2;
    uint8 AES_BOOTS_IDX = 3;
    struct Aesthetics {
        // Aesthetics
        uint8 background;
        uint8 weapon;
        uint8 armor;
        uint8 boots;
        uint256[] slots;
    }

    Defender[] public defenders;
    Aesthetics[] public aesthetics;

    /// @notice Fetch the slots for the given defender
    /// @dev Used to get the different equiped loot IDs
    /// @param defenderId ID of the Defender to read the slots from
    /// @return slots The slots of the defender
    function getSlots(uint256 defenderId)
        public
        view
        returns (uint256[] memory slots)
    {
        return aesthetics[defenderId].slots;
    }

    /// @notice Generates a random uint value in the given bounds
    /// @dev Responsible for creating a new defender with newly generated attributes
    /// @param _name name of the Defender to create the value for
    /// @return _tokenId ID of the created defender
    function _createDefender(bytes32 _name) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        defenders.push(
            Defender(
                _name,
                1,
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "CHARACTER_TYPE",
                    0,
                    NUM_OF_CHARACTER_TYPES
                ),
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "HEALTH",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "SPEED",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "STRENGTH",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                _generateRandomUintValueInBounds(
                    _name,
                    tokenId,
                    "DEFENSE",
                    INIT_ATTR_MIN,
                    INIT_ATTR_MAX
                ),
                0,
                0
            )
        );
        aesthetics.push(Aesthetics(0, 0, 0, 0, new uint256[](4)));

        _tokenIdCounter.increment();
        emit NewDefenderGenerated(tokenId, _name);
        return tokenId;
    }

    /// @notice Generates a random uint value in the given bounds
    /// @dev Used in _createDefender to generate initial attributes
    /// @param _name name of the Defender to generate the value for
    /// @param _tokenId ID of the Defender to generate the value for
    /// @param _key Key of the attribute we're generating for
    /// @param _minValue Minimum value to generate
    /// @param _maxValue Maximum value to generate
    /// @return The generated random value
    function _generateRandomValueInBounds(
        bytes32 _name,
        uint256 _tokenId,
        string memory _key,
        uint8 _minValue,
        uint8 _maxValue
    ) private pure returns (uint8) {
        uint256 rand = uint256(
            keccak256(abi.encodePacked(_name, _key, toString(_tokenId)))
        );
        return uint8(_minValue + (rand % (_maxValue - _minValue)));
    }

    // TODO public ?
    /// @notice Calls _createDefender to create a new defender
    /// @dev Called when minting
    /// @param _name name of the Defender to create
    /// @return _tokenId ID of the created defender
    function createRandomDefender(bytes32 _name)
        public
        returns (uint256 _tokenId)
    {
        _tokenId = _createDefender(_name);
    }
}
