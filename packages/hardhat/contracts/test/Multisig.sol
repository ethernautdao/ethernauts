//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "../Ethernauts.sol";

contract Multisig {
    Ethernauts private _ethernauts;

    constructor(Ethernauts ethernauts) {
        _ethernauts = ethernauts;
    }

    function mint() external payable {
        _ethernauts.mint{value: msg.value}();
    }

    function mintEarly(bytes memory signedCoupon) external payable {
        _ethernauts.mintEarly{value: msg.value}(signedCoupon);
    }

    function transfer(address target, uint tokenId) external {
        _ethernauts.transferFrom(address(this), target, tokenId);
    }
}
