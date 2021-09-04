//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Ethernauts is ERC721Enumerable, Ownable {
    using Address for address payable;

    uint public immutable maxTokens;
    uint public immutable maxGiftable;
    bytes32 public immutable provenance;

    string public baseTokenURI;

    uint public tokensGifted;

    uint public daoPercent;
    uint public artistPercent;

    uint private constant _PERCENT = 1000000;

    constructor(
        uint maxGiftable_,
        uint maxTokens_,
        uint daoPercent_,
        uint artistPercent_,
        bytes32 provenance_
    ) ERC721("Ethernauts", "ETHNTS") {
        require(maxGiftable_ <= 100, "Max giftable supply too large");
        require(maxTokens_ <= 10000, "Max token supply too large");
        require(daoPercent_ + artistPercent_ == _PERCENT, "Invalid percentages");
        require(provenance_ != bytes32(0), "Invalid provenance hash");

        maxGiftable = maxGiftable_;
        maxTokens = maxTokens_;
        daoPercent = daoPercent_;
        artistPercent = artistPercent_;
        provenance = provenance_;
    }

    // --------------------
    // Public external ABI
    // --------------------

    function mint() external payable {
        require(msg.value >= 0.2 ether, "Insufficient payment");

        _mintNext(msg.sender);
    }

    function exists(uint tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    // -----------------------
    // Protexted external ABI
    // -----------------------

    function gift(address to) external onlyOwner {
        require(tokensGifted < maxGiftable, "No more Ethernauts can be gifted");

        _mintNext(to);

        tokensGifted += 1;
    }

    function setBaseURI(string memory baseTokenURI_) public onlyOwner {
        baseTokenURI = baseTokenURI_;
    }

    // TODO: Need re-entrancy guard?
    function withdraw(address payable dao, address payable artist) external onlyOwner {
        // TODO: Safety checks on addresses

        uint balance = address(this).balance;

        uint daoScaled = balance * daoPercent;
        uint artistScaled = balance * artistPercent;

        dao.sendValue(daoScaled / _PERCENT);
        artist.sendValue(artistScaled / _PERCENT);
    }

    // -------------------
    // Internal functions
    // -------------------

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function _mintNext(address to) internal {
        uint tokenId = totalSupply();

        _mint(to, tokenId);
    }

    function _mint(address to, uint tokenId) internal virtual override {
        require(totalSupply() < maxTokens, "No more Ethernauts can be minted");

        super._mint(to, tokenId);
    }
}
