//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Ethernauts is ERC721, Ownable {
    using Address for address payable;

    uint public immutable maxEthernauts;

    uint256 public tokensMinted;

    constructor(uint maxEthernauts_) ERC721("Ethernauts", "ETHNTS") {
        require(maxEthernauts_ <= 10000, "Max Ethernauts supply too large");

        maxEthernauts = maxEthernauts_;
    }

    function mint() external payable {
        require(tokensMinted < maxEthernauts, "No more Ethernauts can be minted");

        uint256 tokenId = tokensMinted;

        _mint(msg.sender, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        super._mint(to, tokenId);

        tokensMinted += 1;
    }

    function withdraw(address payable payee) external onlyOwner {
        payee.sendValue(address(this).balance);
    }
}
