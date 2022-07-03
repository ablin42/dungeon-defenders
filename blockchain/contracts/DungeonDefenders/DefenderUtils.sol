// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DefenderFactory.sol";

contract DefenderUtils is DefenderFactory {
    event DefenderLeveledUp(uint256 defenderId, uint8 level);

    mapping (uint256 => uint256) public defenderExperience;

    // based on exp(level) = round(2^((level - 1) / 3) * 1000 - 1000)
    uint32[10] levelToExp = [
        0,      // level 1
        260,    // level 2
        587,    // level 3
        1000,   // level 4
        1520,   // level 5
        2175,   // level 6
        3000,   // level 7
        4040,   // level 8
        5849,   // level 9
        7000    // level 10
    ];

    function gainExperience(uint256 _tokenId, uint256 _expToGain) external {
        // TODO permissions
        require(defenders[_tokenId].level < 10, "Defender is already max level");
        require(defenderExperience[_tokenId] + _expToGain > defenderExperience[_tokenId], "Can't gain anymore experience");
        defenderExperience[_tokenId] += _expToGain;
        uint8 updatedLevel = getLevelFromExperience(defenderExperience[_tokenId]);
        if (updatedLevel != defenders[_tokenId].level) {
            defenders[_tokenId].level = updatedLevel;
            defenders[_tokenId].health = uint8(uint16(defenders[_tokenId].health) * 107 / 100);
            defenders[_tokenId].speed = uint8(uint16(defenders[_tokenId].speed) * 107 / 100);
            defenders[_tokenId].strength = uint8(uint16(defenders[_tokenId].strength) * 107 / 100);
            defenders[_tokenId].defense = uint8(uint16(defenders[_tokenId].defense) * 107 / 100);
            emit DefenderLeveledUp(_tokenId, updatedLevel);
        }
    }

    function getLevelFromExperience(uint256 _experience) internal view returns (uint8 _level) {
        _level = 0;
        for (_level; _level < 10 && _experience >= levelToExp[_level]; _level++) {}
    }

    function updateWinTracker(uint256 _tokenId, bool _won) external {
        // TODO permissions
        if (_won) {
            defenders[_tokenId].dungeonWins++;
        } else {
            defenders[_tokenId].dungeonLosses++;
        }
    }
}