//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Ethernauts is ERC721, Ownable {
    using Address for address payable;

    uint256 _tokensMinted;

    constructor() ERC721("Ethernauts", "ETHNTS") {

    }

    function mint() external payable {
        uint256 tokenId = _tokensMinted;

        _mint(msg.sender, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        super._mint(to, tokenId);

        _tokensMinted += 1;
    }

    function withdraw(address payable payee) external onlyOwner {
        payee.sendValue(address(this).balance);
    }
}
