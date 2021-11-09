//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@ethernauts/hardhat/contracts/Ethernauts.sol";

contract EthernautsMain is Ethernauts {
    constructor(
      uint definitiveMaxGiftable,
      uint definitiveMaxTokens,
      uint definitiveBatchSize,
      uint initialMintPrice,
      uint initialEarlyMintPrice,
      address initialCouponSigner
    ) Ethernauts(
      definitiveMaxGiftable,
      definitiveMaxTokens,
      definitiveBatchSize,
      initialMintPrice,
      initialEarlyMintPrice,
      initialCouponSigner
    // solhint-disable-next-line no-empty-blocks
    ) {}
}
