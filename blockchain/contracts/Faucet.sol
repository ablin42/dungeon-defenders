// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GemsFaucet is Ownable {
    IERC20 public gemsToken;
    uint256 public DRIP_AMOUNT = 500 * 10**18;

    event Claim(address owner, uint256 amount);
    event Deposit(address owner, uint256 amount);
    event Withdraw(address owner, uint256 amount);

    constructor(IERC20 _gemsToken) {
        gemsToken = _gemsToken;
    }

    // Useful for the contract to self check its gems balance
    function gemsBalance(address _staker) public view returns (uint256) {
        return gemsToken.balanceOf(_staker);
    }

    // Might need reentrancy guard here
    function claim() public {
        gemsToken.transfer(msg.sender, DRIP_AMOUNT);
        emit Claim(msg.sender, DRIP_AMOUNT);
    }

    // Deposit some gems in the contract
    function deposit(uint256 amount) public {
        require(
            gemsToken.balanceOf(msg.sender) >= amount,
            "Insufficient amount of gems"
        );
        gemsToken.transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }

    // Owner can withdraw the gems in the contract
    function withdraw() external onlyOwner {
        address owner = owner();
        uint256 balance = gemsBalance(address(this));
        gemsToken.transfer(owner, balance);
        emit Withdraw(owner, balance);
    }
}
