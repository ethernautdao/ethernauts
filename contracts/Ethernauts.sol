//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ethernauts is ERC721, Ownable {
    using Address for address payable;

    uint public immutable maxTokens;
    uint public immutable maxGiftable;
    bytes32 public immutable provenance;

    string public assetsURI;

    uint public tokensGifted;
    uint public tokensMinted;

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

    function exists(uint tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function setBaseURI(string memory assetsURI_) public onlyOwner {
        assetsURI = assetsURI_;
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
        return assetsURI;
    }

    function _mintNext(address to) internal {
        uint tokenId = tokensMinted;

        _mint(to, tokenId);
    }

    function _mint(address to, uint tokenId) internal virtual override {
        require(tokensMinted < maxTokens, "No more Ethernauts can be minted");

        super._mint(to, tokenId);

        tokensMinted += 1;
    }
}
