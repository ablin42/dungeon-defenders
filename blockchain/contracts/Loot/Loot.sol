// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LootFactory.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract DungeonLoot is ERC721, ERC721URIStorage, LootFactory {

    constructor() ERC721("DungeonLoot", "DLOOT") {
        // tokenId == 0 is used to indicate no loot
        safeMint(address(this), "NULL_LOOT");
    }

    function safeMint(address to, bytes32 name) public {
        uint tokenId = createRandomLoot(name);
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) override(ERC721, ERC721URIStorage) public view returns (string memory) {
        string[21] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = bytes32ToString(loot[tokenId].name);

        parts[2] = '</text><text x="10" y="40" class="base">Min Level Required: ';

        parts[3] = toString(loot[tokenId].minLevelRequired);

        parts[4] = '</text><text x="10" y="60" class="base">Health: ';

        parts[5] = intToString(loot[tokenId].health);

        parts[6] = '</text><text x="10" y="80" class="base">Speed: ';

        parts[7] = intToString(loot[tokenId].speed);

        parts[8] = '</text><text x="10" y="100" class="base">Strength: ';

        parts[9] = intToString(loot[tokenId].strength);

        parts[10] = '</text><text x="10" y="120" class="base">Defense: ';

        parts[11] = intToString(loot[tokenId].defense);

        parts[12] = '</text><text x="10" y="140" class="base">Background Type: ';

        parts[13] = toString(loot[tokenId].background);

        parts[14] = '</text><text x="10" y="160" class="base">Weapon Type: ';

        parts[15] = toString(loot[tokenId].weapon);
        
        parts[16] = '</text><text x="10" y="180" class="base">Armor Type: ';

        parts[17] = toString(loot[tokenId].armor);

        parts[18] = '</text><text x="10" y="200" class="base">Boots Type: ';

        parts[19] = toString(loot[tokenId].boots);

        parts[20] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8]));
        output = string(abi.encodePacked(output, parts[9], parts[10], parts[11], parts[12], parts[13], parts[14], parts[15], parts[16]));
        output = string(abi.encodePacked(output, parts[17], parts[18], parts[19], parts[20]));
        
        string memory json = string(abi.encodePacked(
            '{'
            '"name": "Defender #', toString(tokenId), '", '
            '"description": "Dungeon Defenders is an NFT web game where you collect defenders and loot and rid dungeons of their monsters for riches!", '
            '"external_url":"http://dungeondefenders.xyz", '
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '", '
            '"attributes": ['
            '{"trait_type":"Name", "value":"', parts[1], '"},'
            '{"trait_type":"Min Level Required", "value":"', parts[3], '"},'
            '{"trait_type":"Health", "value":"', parts[5], '"},'
        ));
        json = string(abi.encodePacked(
            json,
            '{"trait_type":"Speed", "value":"', parts[7], '"},'
            '{"trait_type":"Strength", "value":"', parts[9], '"},'
            '{"trait_type":"Defense", "value":"', parts[11], '"},'
            '{"trait_type":"Background Type", "value":"', parts[13], '"},'
        ));
        json = string(abi.encodePacked(
            json,
            '{"trait_type":"Weapon Type", "value":"', parts[15], '"},'
            '{"trait_type":"Armor Type", "value":"', parts[17], '"},'
            '{"trait_type":"Boots Type", "value":"', parts[19], '"}'
            ']}'
        ));
        json= Base64.encode(bytes(json));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }
}