// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Gems utility token for DungeonDefenders
/// @author rkhadder & 0xharb
contract Gems is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Dungeon Gems", "GEMS") {
        _mint(msg.sender, 100000000 * 10**18);
    }
}
