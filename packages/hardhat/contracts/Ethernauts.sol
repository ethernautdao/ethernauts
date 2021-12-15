//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Ethernauts is ERC721Enumerable, Ownable {
    using Address for address payable;
    using Strings for uint256;

    // Can be set only once on deploy
    uint256 public immutable maxTokens;
    uint256 public immutable maxGiftable;
    uint256 public immutable batchSize;

    // Can be changed by owner until minting stopped
    string public baseTokenURI;

    uint256 public mintPrice;

    uint256 public earlyMintPrice;

    address public couponSigner;

    // Internal usage
    uint256 private _tokensGifted;
    mapping(address => bool) private _redeemedCoupons; // user address => if its single coupon has been redeemed
    uint256[] private _randomNumbers;

    bool public permanentUrl;

    // Three different sale stages:
    enum SaleState {
        Paused, // No one can mint, except the owner via gifting (default)
        Early, // Only community can mint, at a discount using signed messages
        Open, // Anyone can mint
        PublicCompleted // Public sale completed
    }

    SaleState public currentSaleState;
    event SaleStateChanged(SaleState state);
    event BaseTokenURIChanged(string baseTokenURI);
    event EarlyMintPriceChanged(uint256 earlyMintPrice);
    event MintPriceChanged(uint256 mintPrice);
    event CouponSignerChanged(address couponSigner);
    event WithdrawTriggered(address beneficiary);
    event PermanentURITriggered(bool value);

    constructor(
        uint256 definitiveMaxGiftable,
        uint256 definitiveMaxTokens,
        uint256 definitiveBatchSize,
        uint256 initialMintPrice,
        uint256 initialEarlyMintPrice,
        address initialCouponSigner
    ) ERC721("Ethernauts", "NAUTS") {
        require(definitiveMaxGiftable <= 100, "Max giftable supply too large");
        require(definitiveMaxTokens <= 10000, "Max token supply too large");

        maxGiftable = definitiveMaxGiftable;
        maxTokens = definitiveMaxTokens;
        batchSize = definitiveBatchSize;

        mintPrice = initialMintPrice;
        earlyMintPrice = initialEarlyMintPrice;
        couponSigner = initialCouponSigner;

        currentSaleState = SaleState.Paused;
    }

    // ----------
    // Modifiers
    // ----------

    modifier onlyOnState(SaleState definedSaleState) {
        require(getCurrentSaleState() == definedSaleState, "Not allowed in current state");
        _;
    }

    // --------------------
    // Public external ABI
    // --------------------

    function getCurrentSaleState() public view returns (SaleState) {
        return currentSaleState;
    }

    function mint() external payable onlyOnState(SaleState.Open) {
        require(msg.value >= mintPrice, "Invalid msg.value");
        require(availableToMint() > 0, "No available supply");

        _mintNext(msg.sender);

        if (availableToMint() == 0) {
            currentSaleState = SaleState.PublicCompleted;
        }
    }

    function mintEarly(bytes memory signedCoupon) external payable onlyOnState(SaleState.Early) {
        require(msg.value >= earlyMintPrice, "Invalid msg.value");
        require(availableToMint() > 0, "No available supply");
        require(!userRedeemedCoupon(msg.sender), "Used coupon");
        require(isCouponSignedForUser(msg.sender, signedCoupon), "Invalid coupon");

        _mintNext(msg.sender);

        _redeemedCoupons[msg.sender] = true;
    }

    function tokensGifted() external view returns (uint256) {
        return _tokensGifted;
    }

    function availableSupply() public view returns (uint256) {
        return maxTokens - totalSupply();
    }

    function availableToMint() public view returns (uint256) {
        return availableSupply() - availableToGift();
    }

    function availableToGift() public view returns (uint256) {
        return maxGiftable - _tokensGifted;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function isCouponSignedForUser(address user, bytes memory coupon) public view returns (bool) {
        bytes32 messageHash = keccak256(abi.encode(user));
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(messageHash);

        address retrievedSigner = ECDSA.recover(prefixedHash, coupon);

        return couponSigner == retrievedSigner;
    }

    function userRedeemedCoupon(address user) public view returns (bool) {
        return _redeemedCoupons[user];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory baseURI = _baseURI();

        uint256 batchId = tokenId / batchSize;
        if (batchId >= _randomNumbers.length) {
            return string(abi.encodePacked(baseURI, "travelling_to_destination"));
        }

        uint256 randomNumber = _randomNumbers[batchId];
        uint256 offset = randomNumber % batchSize;
        uint256 maxTokenIdInBatch = batchSize * (batchId + 1) - 1;

        uint256 assetId = tokenId + offset;
        if (assetId > maxTokenIdInBatch) {
            assetId -= batchSize;
        }

        return string(abi.encodePacked(baseURI, assetId.toString()));
    }

    function getRandomNumberForBatch(uint batchId) public view returns (uint) {
        return _randomNumbers[batchId];
    }

    function getRandomNumberCount() public view returns (uint) {
        return _randomNumbers.length;
    }

    // -----------------------
    // Protected external ABI
    // -----------------------

    function gift(address to) external onlyOwner {
        require(_tokensGifted < maxGiftable, "No more Ethernauts can be gifted");

        _mintNext(to);

        _tokensGifted += 1;
    }

    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
        emit MintPriceChanged(newMintPrice);
    }

    function setEarlyMintPrice(uint256 newEarlyMintPrice) external onlyOwner {
        earlyMintPrice = newEarlyMintPrice;
        emit EarlyMintPriceChanged(newEarlyMintPrice);
    }

    function setBaseURI(string calldata newBaseTokenURI) external onlyOwner {
        require(!permanentUrl, "NFTs minting finished");
        baseTokenURI = newBaseTokenURI;
        emit BaseTokenURIChanged(newBaseTokenURI);
    }

    function setSaleState(SaleState newSaleState) external onlyOwner {
        require(currentSaleState != SaleState.PublicCompleted, "Sale is completed");
        require(newSaleState != currentSaleState && newSaleState != SaleState.PublicCompleted, "Invalid new state");

        currentSaleState = newSaleState;
        emit SaleStateChanged(newSaleState);
    }

    function setCouponSigner(address newCouponSigner) external onlyOwner {
        couponSigner = newCouponSigner;
        emit CouponSignerChanged(newCouponSigner);
    }

    function setPermanentURI() external onlyOwner {
        permanentUrl = true;
        emit PermanentURITriggered(true);
    }

    function withdraw(address payable beneficiary) external onlyOwner {
        beneficiary.sendValue(address(this).balance);
        emit WithdrawTriggered(beneficiary);
    }

    function recoverTokens(
        address token,
        address to,
        uint256 value
    ) external onlyOwner {
        require(token != to, "Invalid destination");
        require(IERC20(token).balanceOf(address(this)) >= value, "Invalid amount");

        IERC20(token).transfer(to, value);
    }

    // -------------------
    // Private functions
    // -------------------

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function _mintNext(address to) private {
        uint256 tokenId = totalSupply();

        _mint(to, tokenId);

        _tryGenerateRandomNumber();
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        require(totalSupply() < maxTokens, "No available supply");
        super._mint(to, tokenId);
    }

    function _tryGenerateRandomNumber() private {
        uint256 randomNumberIdx = _randomNumbers.length;

        uint256 maxTokenIdInBatch = batchSize * (randomNumberIdx + 1) - 1;
        if (totalSupply() < maxTokenIdInBatch) {
            return;
        }

        // solhint-disable not-rely-on-time
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(msg.sender, block.difficulty, block.timestamp, randomNumberIdx))
        );
        // solhint-enable not-rely-on-time

        _randomNumbers.push(randomNumber);
    }
}
