// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../ContractUtils.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract DefenderFactory is ContractUtils{
    using Counters for Counters.Counter;

    event NewDefenderGenerated(uint defenderId, bytes32 name);

    Counters.Counter private _tokenIdCounter;

    uint8 INIT_ATTR_MIN = 40;
    uint8 INIT_ATTR_MAX = 100;
    uint8 NUM_OF_CHARACTER_TYPES = 6;

    struct Defender {
        bytes32 name; 
        uint8 level;
        uint8 characterType;
        uint8 health;
        uint8 speed;
        uint8 strength;
        uint8 defense;

        uint8 dungeonWins;
        uint8 dungeonLosses;
    }

    Defender[] public defenders;

    function _createDefender(bytes32 _name) internal returns (uint) {
        uint tokenId = _tokenIdCounter.current();
        defenders.push(Defender(
            _name,
            1,
            _generateRandomValueInBounds(_name, tokenId, "CHARACTER_TYPE", 0, NUM_OF_CHARACTER_TYPES),
            _generateRandomValueInBounds(_name, tokenId, "HEALTH", INIT_ATTR_MIN, INIT_ATTR_MAX),
            _generateRandomValueInBounds(_name, tokenId, "SPEED", INIT_ATTR_MIN, INIT_ATTR_MAX),
            _generateRandomValueInBounds(_name, tokenId, "STRENGTH", INIT_ATTR_MIN, INIT_ATTR_MAX),
            _generateRandomValueInBounds(_name, tokenId, "DEFENSE", INIT_ATTR_MIN, INIT_ATTR_MAX),
            0,
            0
        ));

        _tokenIdCounter.increment();
        emit NewDefenderGenerated(tokenId, _name);
        return tokenId;
    }

    function _generateRandomValueInBounds(bytes32 _name, uint _tokenId, string memory _key, uint8 _minValue, uint8 _maxValue) private pure returns (uint8) {
        uint rand = uint(keccak256(abi.encodePacked(_name, _key, toString(_tokenId))));
        return uint8(_minValue + rand % (_maxValue - _minValue));
    }

    function createRandomDefender(bytes32 _name) public returns (uint _tokenId)  {
        _tokenId = _createDefender(_name);
    }
}
