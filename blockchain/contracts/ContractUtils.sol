// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ContractUtils {
    function _generateRandomUintValueInBounds(bytes32 _name, uint _tokenId, string memory _key, uint8 _minValue, uint8 _maxValue) internal pure returns (uint8) {
        uint rand = uint(keccak256(abi.encodePacked(_name, _key, toString(_tokenId))));
        return uint8(_minValue + rand % (_maxValue - _minValue));
    }
    
    function _generateRandomIntValueInBounds(bytes32 _name, uint _tokenId, string memory _key, int8 _minValue, int8 _maxValue) internal pure returns (int8) {
        uint rand = uint(keccak256(abi.encodePacked(_name, _key, toString(_tokenId))));
        uint8 delta = uint8(_maxValue - _minValue);
        return _minValue + int8(int(rand % delta));
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function intToString(int256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = 0;
        if (value < 0) {
            temp = uint256(-1 * value);
        } else {
            temp = uint256(value);
        }
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        if (value < 0) {
            digits++;
            buffer[0] = '-';
        }
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        // https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}