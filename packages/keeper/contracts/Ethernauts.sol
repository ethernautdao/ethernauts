//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Ethernauts as EthernautsBase} from "@ethernauts/hardhat/contracts/Ethernauts.sol";

contract Ethernauts is EthernautsBase {
    constructor(
        uint definitiveMaxGiftable,
        uint definitiveMaxTokens,
        uint definitiveBatchSize,
        uint initialMintPrice,
        uint initialEarlyMintPrice,
        address initialCouponSigner
    )
        EthernautsBase(
            definitiveMaxGiftable,
            definitiveMaxTokens,
            definitiveBatchSize,
            initialMintPrice,
            initialEarlyMintPrice,
            initialCouponSigner
        )
    {} // solhint-disable-line no-empty-blocks
}
