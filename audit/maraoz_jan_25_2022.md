### Document
https://pastebin.com/DWAEpn9L

### PRs addressing observations
* https://github.com/ethernautdao/ethernauts/pull/208
* https://github.com/ethernautdao/ethernauts/pull/209
* https://github.com/ethernautdao/ethernauts/pull/211

### Content
EthernautDAO NFT audit 24-01-2022
 
general comments
  - this is an informal audit by @maraoz. technical opinions expressed here are my own only and not related to OpenZeppelin in any way.
  - I audited commit f59de9ab8e6a676adbae17093e49413e926049a7. all line numbers refer to that version of the code.
  - very tidy and easy to read code. a pleasure to audit. congrats to the authors.
 
issues found
 
 
- medium
  - _safeMint from OpenZeppelin's ERC721 fails if the receiving address is a contract which doesn't implement the interface `onERC721Received(address,address,uint256,bytes)` (eg: a GnosisSafe or multisig). Consider changing this line to use `mint` if you want people to receive EthernautDAO NFTs to GnosisSafe, multisig, or any contract which doesn't implement that interface. 
  - Consider allowing the owner to call `_generateRandomNumber` to "unlock" an incomplete batch (in case total tokens minted at the end is not a multiple of `batchSize`). Maybe the coupons mechanism was added to solve this problem by "rounding up" to the next batch size. If so, ignore this. Otherwise, this contracts needs a mechanism to call `_generateRandomNumber` if the final total tokens minted is not a multiple of `batchSize`.
 
 
- low
  - comment on line 285 reads "Can only be called if NFTs arent done minting.", which doesn't seem to be correct (permanentUrl can be set by the owner at any time). fix the code or the comment. 
  - any coupons signed by couponSigner will be invalid after calling `setCouponSigner` because of the check in line 191
  - I think `CouponSignedForAnotherUser` name is misleading. Won't that revert occur when the signature is from an old coupon signer, instead of "for another user", as the name implies? Seems to me like that if the coupon is for another user, the signature check will fail before that revert (sorry to report this as a question, but you guys can check it easily)
 
 
- info / suggestions
  - contract allows state to go back to 'Early' from 'Open'.
  - rename maxGiftable to maxGiftableTokens for clarity.
  - create and test (edge cases) a view function `getCurrentBatch` that returns `tokenId / batchSize` to reduce code repetition.
  - create and test (edge cases) a view function `getMaxTokenIdInBatch(batch)` that returns `batchSize * (batchId + 1) - 1` to reduce code repetition.
  - create and test (edge cases) a view function `getAssetIDForTokenID()` that returns the assetId for each tokenId. Use that in `tokenURI()`.
  - change `definitiveMaxTokens` from constructor argument to a constant equal to 10000 and remove `MaxTokensTooLarge`.
  - Consider renaming NoChange to NoSaleStateChange
  - Consider renaming InsufficientTokenBalance to InsufficientERC20Balance to avoid confusion with the Ethernaut token.
  - Consider using `!isTokenRevealed()` in line 208 for more clarity (line 207 can be moved below that check)
  - Consider renaming `batchId` everywhere to `batch`. (same with `currentBatchId` to `currentBatch`)
  - when deploying, remember mintPrice and earlyMintPrice units are in wei! careful with deployment scripts using JavaScript numbers which can have weird behavior with big numbers (unless you're using `BigNumber` / `BN`). Same with the setter function. double check any scripts calling those (or consider removing the setters unless absolutely needed).
  - Consider making urlChanger immutable and removing the setter. Given that the owner can also change the URL this state change seems unnecessary to me. If so, remove UrlChangerChanged too.
