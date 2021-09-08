//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.6;

interface IChallenge {
    function discountsAvailable() external view returns (uint);

    function discountsGiven() external view returns (uint);

    function discountFor(address who) external view returns (uint);
}
