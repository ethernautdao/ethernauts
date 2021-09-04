//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Ethernauts is ERC721, Ownable {
    using Address for address payable;

    uint public immutable maxTokens;
    uint public immutable maxGiftable;

    uint256 public tokensGifted;
    uint256 public tokensMinted;

    uint256 public daoPercent;
    uint256 public artistPercent;

    uint256 constant PERCENT = 1000000;

    constructor(
        uint maxGiftable_,
        uint maxTokens_,
        uint daoPercent_,
        uint artistPercent_
    ) ERC721("Ethernauts", "ETHNTS") {
        require(maxGiftable_ <= 100, "Max giftable supply too large");
        require(maxTokens_ <= 10000, "Max token supply too large");
        require(daoPercent_ + artistPercent_ == PERCENT, "Invalid dao and artist percentages");

        maxGiftable = maxGiftable_;
        maxTokens = maxTokens_;
        daoPercent = daoPercent_;
        artistPercent = artistPercent_;
    }

    // -------------
    // External ABI
    // -------------

    function mint() external payable {
        require(msg.value >= 0.2 ether, "Insufficient payment");

        _mintNext(msg.sender);
    }

    function gift(address to) external onlyOwner {
        require(tokensGifted < maxGiftable, "No more Ethernauts can be gifted");

        _mintNext(to);

        tokensGifted += 1;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
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

    // -------------------
    // Internal functions
    // -------------------

    function _mintNext(address to) internal {
        uint256 tokenId = tokensMinted;

        _mint(to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        require(tokensMinted < maxTokens, "No more Ethernauts can be minted");

        super._mint(to, tokenId);

        tokensMinted += 1;
    }

}
