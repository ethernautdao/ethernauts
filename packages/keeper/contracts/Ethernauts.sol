//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Ethernauts as EthernautsBase} from "@ethernauts/hardhat/contracts/Ethernauts.sol";

contract Ethernauts is EthernautsBase {
    constructor(
        uint256 definitiveMaxGiftable,
        uint256 definitiveMaxTokens,
        uint256 definitiveBatchSize,
        bytes32 definitiveProvenanceHash,
        uint256 initialMintPrice,
        uint256 initialEarlyMintPrice,
        address initialCouponSigner,
        address initialUrlChanger
    )
        EthernautsBase(
            definitiveMaxGiftable,
            definitiveMaxTokens,
            definitiveBatchSize,
            definitiveProvenanceHash,
            initialMintPrice,
            initialEarlyMintPrice,
            initialCouponSigner,
            initialUrlChanger
        )
    {} // solhint-disable-line no-empty-blocks
}
