//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.6;

import "../interfaces/IChallenge.sol";

contract BasicChallenge is IChallenge {
    uint public maxDiscounts;
    uint public givenDiscounts;

    mapping(address => uint) private _discountForAddress;

    constructor(uint maxDiscounts_) {
        maxDiscounts = maxDiscounts_;
    }

    function register() external {
        require(givenDiscounts <= maxDiscounts, "Capacity exceeded");

        _discountForAddress[msg.sender] = 0.15 ether;

        givenDiscounts += 1;
    }

    function discountFor(address who) external view override returns (uint) {
        return _discountForAddress[who];
    }

    function discountsGiven() public view override returns (uint) {
        return givenDiscounts;
    }

    function discountsAvailable() public view override returns (uint) {
        return maxDiscounts - givenDiscounts;
    }
}
