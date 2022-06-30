// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DefenderUtils.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

interface ILoot {
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

    function loot(uint256 tokenId) external view returns (Loot memory loot);

    function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract DungeonDefenders is ERC721, ERC721URIStorage, DefenderUtils {
    ILoot public lootToken;

    constructor(ILoot _lootToken) ERC721("DungeonDefenders", "DDS") {
        lootToken = _lootToken;
    }

    // when we have a final app
    // function _baseURI() internal pure override returns (string memory) {
    //     return "https://ourapp.vercel.app/api";
    // }

    function safeMint(address to, bytes32 name) public {
        uint256 tokenId = createRandomDefender(name);
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string[17] memory parts;

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = bytes32ToString(defenders[tokenId].name);

        parts[2] = '</text><text x="10" y="40" class="base">Level: ';

        parts[3] = toString(defenders[tokenId].level);

        parts[4] = '</text><text x="10" y="60" class="base">Health: ';

        parts[5] = toString(defenders[tokenId].health);

        parts[6] = '</text><text x="10" y="80" class="base">Speed: ';

        parts[7] = toString(defenders[tokenId].speed);

        parts[8] = '</text><text x="10" y="100" class="base">Strength: ';

        parts[9] = toString(defenders[tokenId].strength);

        parts[10] = '</text><text x="10" y="120" class="base">Defense: ';

        parts[11] = toString(defenders[tokenId].defense);

        parts[
            12
        ] = '</text><text x="10" y="140" class="base">Dungeon Defended: ';

        parts[13] = toString(defenders[tokenId].dungeonWins);

        parts[
            14
        ] = '</text><text x="10" y="160" class="base">Dungeons Attempted: ';

        parts[15] = toString(
            defenders[tokenId].dungeonWins + defenders[tokenId].dungeonLosses
        );

        parts[16] = "</text></svg>";

        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6],
                parts[7],
                parts[8]
            )
        );
        output = string(
            abi.encodePacked(
                output,
                parts[9],
                parts[10],
                parts[11],
                parts[12],
                parts[13],
                parts[14],
                parts[15],
                parts[16]
            )
        );

        string memory json = string(
            abi.encodePacked(
                "{"
                '"name": "Defender #',
                toString(tokenId),
                '", '
                '"description": "Dungeon Defenders is an NFT web game where you collect defenders and loot and rid dungeons of their monsters for riches!", '
                '"external_url":"http://dungeondefenders.xyz", '
                '"image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(output)),
                '", '
                '"attributes": ['
                '{"trait_type":"Name", "value":"',
                parts[1],
                '"},'
                '{"trait_type":"Level", "value":"',
                parts[3],
                '"},'
                '{"trait_type":"Health", "value":"',
                parts[5],
                '"},'
            )
        );
        json = string(
            abi.encodePacked(
                json,
                '{"trait_type":"Speed", "value":"',
                parts[7],
                '"},'
                '{"trait_type":"Strength", "value":"',
                parts[9],
                '"},'
                '{"trait_type":"Defense", "value":"',
                parts[11],
                '"},'
                '{"trait_type":"Dungeons Defended", "value":"',
                parts[13],
                '"},'
                '{"trait_type":"Dungeons Attempted", "value":"',
                parts[15],
                '"}'
                "]}"
            )
        );
        json = Base64.encode(bytes(json));
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }

    function equipLoot(uint256 _defenderId, uint256 _lootId) public {
        require(
            ownerOf(_defenderId) == msg.sender,
            "Must own defender"
        );
        require(
            lootToken.ownerOf(_lootId) == msg.sender,
            "Must own loot"
        );
        ILoot.Loot memory loot = lootToken.loot(_lootId);

        if (loot.background > 0) {
            aesthetics[_defenderId].background = loot.background;
            aesthetics[_defenderId].slots[AES_BACKGROUND_IDX] = _lootId;
        }
        if (loot.weapon > 0) {
            aesthetics[_defenderId].weapon = loot.weapon;
            aesthetics[_defenderId].slots[AES_WEAPON_IDX] = _lootId;
        }
        if (loot.armor > 0) {
            aesthetics[_defenderId].armor = loot.armor;
            aesthetics[_defenderId].slots[AES_ARMOR_IDX] = _lootId;
        }
        if (loot.boots > 0) {
            aesthetics[_defenderId].boots = loot.boots;
            aesthetics[_defenderId].slots[AES_BOOTS_IDX] = _lootId;
        }
    }

    function unequipLoot(uint256 _defenderId, uint256 _lootId) public
    {
        require(
            ownerOf(_defenderId) == msg.sender,
            "Must own defender"
        );
        require(
            lootToken.ownerOf(_lootId) == msg.sender,
            "Must own loot"
        );
        ILoot.Loot memory loot = lootToken.loot(_lootId);

        if (loot.background > 0) {
            aesthetics[_defenderId].background = 0;
            aesthetics[_defenderId].slots[AES_BACKGROUND_IDX] = 0;
        }
        if (loot.weapon > 0) {
            aesthetics[_defenderId].weapon = 0;
            aesthetics[_defenderId].slots[AES_WEAPON_IDX] = 0;
        }
        if (loot.armor > 0) {
            aesthetics[_defenderId].armor = 0;
            aesthetics[_defenderId].slots[AES_ARMOR_IDX] = 0;
        }
        if (loot.boots > 0) {
            aesthetics[_defenderId].boots = 0;
            aesthetics[_defenderId].slots[AES_BOOTS_IDX] = 0;
        }
    }
}
