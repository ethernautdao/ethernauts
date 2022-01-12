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

    error MaxGiftableError(uint256 gifted, uint256 maxGift);
    error MaxTokensError(uint256 definedMax, uint256 maxToken);
    error StateMismatchError(SaleState current, SaleState defined);
    error MintPriceError(uint256 sent, uint256 required);
    error InsufficientToMint(uint available);
    error EarlyMintPriceError(uint256 sent, uint256 required);
    error RedeemedCouponError(bool redeemed);
    error InvalidUserCouponError(bool userCoupon);
    error TokensGiftError(uint256 gifted, uint256 maxToGift);
    error PermanentUrlError(bool permanentURI);
    error CurrentStateError(SaleState currentState, SaleState availableState);
    error SaleStateError(SaleState newState, SaleState current);
    error RecoverTokenError(address tokenAddress, address toAddress);
    error TokenBalanceError(uint256 tokenBalance, uint256 amount);
    error TotalSupplyError(uint256 total, uint256 max);
    error NotAuthorized(address who);

    // Can be set only once on deploy
    uint256 public immutable maxTokens;
    uint256 public immutable maxGiftable;
    uint256 public immutable batchSize;

    // Can be changed by owner until minting stopped
    string public baseTokenURI;

    uint256 public mintPrice;

    uint256 public earlyMintPrice;

    address public couponSigner;

    address public urlChanger;

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
    event UrlChangerChanged(address urlChanger);

    constructor(
        uint256 definitiveMaxGiftable,
        uint256 definitiveMaxTokens,
        uint256 definitiveBatchSize,
        uint256 initialMintPrice,
        uint256 initialEarlyMintPrice,
        address initialCouponSigner
    ) ERC721("Ethernauts", "NAUTS") {
        if (definitiveMaxGiftable > 100) {
            revert MaxGiftableError({gifted: definitiveMaxGiftable, maxGift: 100});
        }

        if (definitiveMaxTokens > 10000) {
            revert MaxTokensError({definedMax: definitiveMaxTokens, maxToken: 10000});
        }

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
        if (currentSaleState != definedSaleState) {
            revert StateMismatchError({current: currentSaleState, defined: definedSaleState});
        }
        _;
    }

    // --------------------
    // Public external ABI
    // --------------------

    /// @notice Mints a single token if at least mintPrice is sent and there are tokens available to mint.
    function mint() external payable onlyOnState(SaleState.Open) {
        if (msg.value < mintPrice) {
            revert MintPriceError({sent: msg.value, required: mintPrice});
        }

        if (availableToMint() == 0) {
            revert InsufficientToMint({available: availableToMint()});
        }

        _mintNext(msg.sender);

        if (availableToMint() == 0) {
            currentSaleState = SaleState.PublicCompleted;
        }
    }

    /// @notice Allows the sender to mint while in early sale state.
    /// @param signedCoupon Coupon given by couponSigner giving the sender early mint access.
    function mintEarly(bytes memory signedCoupon) external payable onlyOnState(SaleState.Early) {
        if (msg.value < earlyMintPrice) {
            revert EarlyMintPriceError({sent: msg.value, required: earlyMintPrice});
        }

        if (availableToMint() == 0) {
            revert InsufficientToMint({available: availableToMint()});
        }

        if (userRedeemedCoupon(msg.sender)) {
            revert RedeemedCouponError({redeemed: userRedeemedCoupon(msg.sender)});
        }

        if (!isCouponSignedForUser(msg.sender, signedCoupon)) {
            revert InvalidUserCouponError({userCoupon: isCouponSignedForUser(msg.sender, signedCoupon)});
        }

        _mintNext(msg.sender);

        _redeemedCoupons[msg.sender] = true;
    }

    /// @notice The number of tokens gifted.
    /// @return The number of tokens gifted.
    function tokensGifted() external view returns (uint256) {
        return _tokensGifted;
    }

    /// @notice Total number of tokens available.
    /// @return The current number of available tokens (max - total current supply).
    function availableSupply() public view returns (uint256) {
        return maxTokens - totalSupply();
    }

    /// @notice Total number of tokens available for minting.
    /// @return The current number of mintable tokens (available supply - gifted supply).
    function availableToMint() public view returns (uint256) {
        return availableSupply() - availableToGift();
    }

    /// @notice Remaining giftable tokens.
    /// @return The amount of giftable tokens remaining (total giftable - already gifted).
    function availableToGift() public view returns (uint256) {
        return maxGiftable - _tokensGifted;
    }

    /// @notice Checks if a token with tokenId exists.
    /// @param tokenId The Id being checked.
    /// @return true if token exists
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /// @notice Checks if the supplied coupon is for the given user.
    /// @param user Address of user.
    /// @param coupon Coupon by couponSigner of the user's address.
    /// @return Returns true if the couponSigner signed for supplied user.
    function isCouponSignedForUser(address user, bytes memory coupon) public view returns (bool) {
        bytes32 messageHash = keccak256(abi.encode(user));
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(messageHash);

        address retrievedSigner = ECDSA.recover(prefixedHash, coupon);

        return couponSigner == retrievedSigner;
    }

    /// @notice Checks to see if the user has redeemed a coupon.
    /// @param user Address of the user.
    /// @return True is the user has redeemed a coupon.
    function userRedeemedCoupon(address user) public view returns (bool) {
        return _redeemedCoupons[user];
    }

    /// @notice Returns the uri for a given token.
    /// @param tokenId Id of token
    /// @return URI of `tokenId` token
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

    /// @notice Fetch the random number for `batchId`
    /// @param batchId Id for the batch.
    /// @return Random number for batchId
    function getRandomNumberForBatch(uint batchId) public view returns (uint) {
        return _randomNumbers[batchId];
    }

    /// @notice Get the number of random numbers
    /// @return Number of random numbers in `_randomNumbers`
    function getRandomNumberCount() public view returns (uint) {
        return _randomNumbers.length;
    }

    /// @notice Checks if the ethernaut reached its destination.
    /// @param tokenId Id for the token.
    /// @return Returns true is the ethernaut arrived
    function isTokenRevealed(uint256 tokenId) public view returns (bool) {
        uint256 batchId = tokenId / batchSize;
        if (batchId >= _randomNumbers.length) {
            return false;
        }

        return true;
    }

    // -----------------------
    // Protected external ABI
    // -----------------------

    /// @notice Gifts a token to the `to` address.
    /// @dev This can only be called by the contract owner.
    /// @param to The address the token is being gifted to.
    function gift(address to) external onlyOwner {
        if (_tokensGifted >= maxGiftable) {
            revert TokensGiftError({gifted: _tokensGifted, maxToGift: maxGiftable});
        }

        _mintNext(to);

        _tokensGifted += 1;
    }

    /// @notice Sets the new mint price for a token.
    /// @dev This can only be called by the contract owner.
    /// @param newMintPrice The new price a token can be bought for.
    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
        emit MintPriceChanged(newMintPrice);
    }

    /// @notice Sets the new early mint price for a token.
    /// @dev This can only be called by the contract owner.
    /// @param newEarlyMintPrice The new early price a token can be bought for.
    function setEarlyMintPrice(uint256 newEarlyMintPrice) external onlyOwner {
        earlyMintPrice = newEarlyMintPrice;
        emit EarlyMintPriceChanged(newEarlyMintPrice);
    }

    /// @notice Sets the base URI for all token URIs.
    /// @dev This can only be called by the contract owner. Can only be called if NFTs arent done minting.
    /// @param newBaseTokenURI The new base URI for tokens.
    function setBaseURI(string calldata newBaseTokenURI) external {
        if (msg.sender != owner() && msg.sender != urlChanger) revert NotAuthorized(msg.sender);
        if (permanentUrl) {
            revert PermanentUrlError({permanentURI: permanentUrl});
        }

        baseTokenURI = newBaseTokenURI;
        emit BaseTokenURIChanged(newBaseTokenURI);
    }

    /// @notice Set the sale state for tokens.
    /// @dev This can only be called by the contract owner.
    /// @param newSaleState The new sale state of the tokens.
    function setSaleState(SaleState newSaleState) external onlyOwner {
        if (currentSaleState == SaleState.PublicCompleted) {
            revert CurrentStateError({currentState: currentSaleState, availableState: SaleState.PublicCompleted});
        }

        if (newSaleState == currentSaleState) {
            revert SaleStateError({newState: newSaleState, current: currentSaleState});
        }

        if (newSaleState == SaleState.PublicCompleted) {
            revert SaleStateError({newState: newSaleState, current: SaleState.PublicCompleted});
        }

        currentSaleState = newSaleState;
        emit SaleStateChanged(newSaleState);
    }

    /// @notice Set the address that can issue coupons.
    /// @dev This can only be called by the contract owner.
    /// @param newCouponSigner New address that can issue coupons.
    function setCouponSigner(address newCouponSigner) external onlyOwner {
        couponSigner = newCouponSigner;
        emit CouponSignerChanged(newCouponSigner);
    }

    /// @notice Freeze the URI so that it cant be updated anymore.
    /// @dev This can only be called by the contract owner.
    function setPermanentURI() external onlyOwner {
        permanentUrl = true;
        emit PermanentURITriggered(true);
    }

    /// @notice Sets address of `urlChanger`
    /// @dev This can only be called by the contract owner.
    /// @param newUrlChanger New address that can change the URI
    function setUrlChanger(address newUrlChanger) external onlyOwner {
        urlChanger = newUrlChanger;
        emit UrlChangerChanged(newUrlChanger);
    }

    /// @notice Withdraws all eth currently held by the contract.
    /// @dev This can only be called by the contract owner. sendValue used to avoid 2300 gas issuance complications.
    /// @param beneficiary The address that funds will be withdrawn to.
    function withdraw(address payable beneficiary) external onlyOwner {
        beneficiary.sendValue(address(this).balance);
        emit WithdrawTriggered(beneficiary);
    }

    /// @notice Withdraw `value` tokens held by this contract.
    /// @dev This can only be called by the contract owner.
    /// @param token Contract address of erc20 token.
    /// @param to Address tokens are being sent to.
    /// @param value The amount of tokens being withdrawn.
    function recoverTokens(
        address token,
        address to,
        uint256 value
    ) external onlyOwner {
        if (token == to) {
            revert RecoverTokenError(token, to);
        }

        if (IERC20(token).balanceOf(address(this)) < value) {
            revert TokenBalanceError({tokenBalance: IERC20(token).balanceOf(address(this)), amount: value});
        }

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

        uint256 currentBatchId = tokenId / batchSize;
        uint256 maxTokenIdInBatch = batchSize * (currentBatchId + 1) - 1;

        if (tokenId == maxTokenIdInBatch) {
            _generateRandomNumber();
        }
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        if (totalSupply() >= maxTokens) {
            revert TotalSupplyError({total: totalSupply(), max: maxTokens});
        }
        super._mint(to, tokenId);
    }

    function _generateRandomNumber() private {
        // solhint-disable not-rely-on-time
        uint256 randomNumber = uint256(
            keccak256(abi.encodePacked(msg.sender, block.difficulty, block.timestamp, _randomNumbers.length))
        );
        // solhint-enable not-rely-on-time

        _randomNumbers.push(randomNumber);
    }
}
