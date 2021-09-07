//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IChallenge {
    function discountsAvailable() external view returns (uint);

    function discountsGiven() external view returns (uint);

    function discountFor(address who) external view returns (uint);
}
