//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../Ethernauts.sol";

contract Reentrant is IERC721Receiver {
    Ethernauts private _ethernauts;

    enum AttackType {
        Mint,
        EarlyMint
    }

    AttackType private _attackType;
    bytes private _signedCoupon;

    constructor(Ethernauts ethernauts) {
        _ethernauts = ethernauts;
    }

    function mint() external payable {
        _attackType = AttackType.Mint;

        _ethernauts.mint{value: msg.value}();
    }

    function mintEarly(bytes memory signedCoupon) external payable {
        _attackType = AttackType.EarlyMint;
        _signedCoupon = signedCoupon;

        _ethernauts.mintEarly{value: msg.value}(signedCoupon);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4) {
        if (_attackType == AttackType.Mint) {
            _ethernauts.mint();
        }

        if (_attackType == AttackType.EarlyMint) {
            _ethernauts.mintEarly(_signedCoupon);
        }

        return this.onERC721Received.selector;
    }
}
