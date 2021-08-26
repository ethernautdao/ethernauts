//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Ethernauts is ERC721, Ownable {
    using Address for address payable;

    constructor() ERC721("Ethernauts", "ETHRNTS") {

    }

    function mint() external payable {

    }

    function withdraw(address payable payee) external onlyOwner {
        payee.sendValue(address(this).balance);
    }
}
