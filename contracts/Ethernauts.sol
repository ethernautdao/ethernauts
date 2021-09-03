//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Ethernauts is ERC721, Ownable {
    using Address for address payable;

    uint public immutable maxEthernauts;

    uint256 public tokensMinted;
    uint256 public daoPercent;
    uint256 public artistPercent;

    uint256 constant PERCENT = 1000000;

    constructor(uint maxEthernauts_, uint daoPercent_, uint artistPercent_) ERC721("Ethernauts", "ETHNTS") {
        require(maxEthernauts_ <= 10000, "Max Ethernauts supply too large");
        require(daoPercent_ + artistPercent_ == PERCENT, "Invalid dao and artist percentages");

        maxEthernauts = maxEthernauts_;
        daoPercent = daoPercent_;
        artistPercent = artistPercent_;
    }

    function mint() external payable {
        require(msg.value >= 0.2 ether, "Insufficient payment");
        require(tokensMinted < maxEthernauts, "No more Ethernauts can be minted");

        uint256 tokenId = tokensMinted;

        _mint(msg.sender, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        super._mint(to, tokenId);

        tokensMinted += 1;
    }

    // TODO: Need re-entrancy guard?
    function withdraw(address payable dao, address payable artist) external onlyOwner {
        // TODO: Safety checks on addresses

        uint256 balance = address(this).balance;

        uint256 daoScaled = balance * daoPercent;
        uint256 artistScaled = balance * artistPercent;

        dao.sendValue(daoScaled / PERCENT);
        artist.sendValue(artistScaled / PERCENT);
    }
}
