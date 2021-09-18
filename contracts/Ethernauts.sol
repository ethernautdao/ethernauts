//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Ethernauts is ERC721Enumerable, Ownable {
    using Address for address payable;

    enum SaleState {
        Paused,
        Early,
        Open
    }

    modifier onlyOnEarlySale() {
        require(saleState == SaleState.Early, "Early sale is not active");
        _;
    }

    modifier onlyOnOpenSale() {
        require(saleState == SaleState.Open, "Open sale is not active");
        _;
    }

    // Fixed
    uint private constant _PERCENT = 1000000; // 1m = 100%, 500k = 50%, etc

    // Can be set only once on deploy
    uint public immutable maxTokens;
    uint public immutable maxGiftable;
    uint public immutable daoPercent;
    uint public immutable artistPercent;
    bytes32 public immutable provenance;

    // Can be changed by owner
    string public baseTokenURI;
    uint public minPrice;
    uint public maxPrice;
    uint public earlyPrice;
    SaleState public saleState;

    // Internal
    uint private _tokensGifted;
    mapping(address => bool) private _receivedDiscount;

    constructor(
        uint maxGiftable_,
        uint maxTokens_,
        uint daoPercent_,
        uint artistPercent_,
        uint minPrice_,
        uint maxPrice_,
        uint earlyPrice_,
        bytes32 provenance_
    ) ERC721("Ethernauts", "ETHNTS") {
        require(maxGiftable_ <= 100, "Max giftable supply too large");
        require(maxTokens_ <= 10000, "Max token supply too large");
        require(daoPercent_ + artistPercent_ == _PERCENT, "Invalid percentages");
        require(provenance_ != bytes32(0), "Invalid provenance hash");
        require(minPrice_ <= maxPrice_, "Invalid price range");

        maxGiftable = maxGiftable_;
        maxTokens = maxTokens_;
        daoPercent = daoPercent_;
        artistPercent = artistPercent_;
        provenance = provenance_;
        minPrice = minPrice_;
        maxPrice = maxPrice_;
        earlyPrice = earlyPrice_;

        saleState = SaleState.Paused;
    }

    // --------------------
    // Public external ABI
    // --------------------

    function mintEarly() external payable onlyOnEarlySale {
        require(msg.value == earlyPrice, "bad msg.value");

        _mintNext(msg.sender);
    }

    function mint() external payable onlyOnOpenSale {
        require(msg.value >= minPrice, "msg.value too low");
        require(msg.value <= maxPrice, "msg.value too high");

        _mintNext(msg.sender);
    }

    function exists(uint tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function tokensGifted() public view returns (uint) {
        return _tokensGifted;
    }

    // -----------------------
    // Protected external ABI
    // -----------------------

    function setSaleState(SaleState newSaleState) external onlyOwner {
        saleState = newSaleState;
    }

    function gift(address to) external onlyOwner {
        require(_tokensGifted < maxGiftable, "No more Ethernauts can be gifted");

        _mintNext(to);

        _tokensGifted += 1;
    }

    function setMinPrice(uint newMinPrice) external onlyOwner {
        require(newMinPrice <= maxPrice, "Invalid price range");

        minPrice = newMinPrice;
    }

    function setMaxPrice(uint newMaxPrice) external onlyOwner {
        require(minPrice <= newMaxPrice, "Invalid price range");

        maxPrice = newMaxPrice;
    }

    function setBaseURI(string memory baseTokenURI_) public onlyOwner {
        baseTokenURI = baseTokenURI_;
    }

    function withdraw(address payable dao, address payable artist) external onlyOwner {
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
