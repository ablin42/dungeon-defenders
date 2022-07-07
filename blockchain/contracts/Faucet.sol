// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Faucet Contract that drips Gems for DungeonDefenders
/// @author rkhadder & 0xharb
/// @notice Requires Gems (ERC20) to be deployed
contract GemsFaucet is Ownable {
    IERC20 public gemsToken;
    uint256 public DRIP_AMOUNT = 500 * 10**18;

    event Claim(address owner, uint256 amount);
    event Deposit(address owner, uint256 amount);
    event Withdraw(address owner, uint256 amount);

    constructor(IERC20 _gemsToken) {
        gemsToken = _gemsToken;
    }

    /// @notice Check Gems balance for _address
    /// @dev Useful for the contract to self check balance
    /// @param _address The address to check the balance of
    /// @return Gems balance for _address
    function gemsBalance(address _address) public view returns (uint256) {
        return gemsToken.balanceOf(_address);
    }

    /// @notice Claim some gems from the contract
    /// @dev Sends DRIP_AMOUNT to msg.sender
    function claim() external {
        gemsToken.transfer(msg.sender, DRIP_AMOUNT);
        emit Claim(msg.sender, DRIP_AMOUNT);
    }

    /// @notice Deposit some Gems in the contract
    /// @param amount Amount of gems to deposit
    function deposit(uint256 amount) external {
        require(
            gemsToken.balanceOf(msg.sender) >= amount,
            "Insufficient amount of gems"
        );
        gemsToken.transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }

    /// @notice Withdraw all gems in the contract
    /// @dev Can only be called by the owner
    function withdraw() external onlyOwner {
        address owner = owner();
        uint256 balance = gemsBalance(address(this));
        gemsToken.transfer(owner, balance);
        emit Withdraw(owner, balance);
    }
}
