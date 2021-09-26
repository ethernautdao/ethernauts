const ethers = require('ethers');
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    local: {
      url: 'http://localhost:8545',
    },
  },
  defaults: {
    maxGiftable: 100,
    maxTokens: 10000,
    mintPrice: ethers.utils.parseEther('0.2'),
    earlyMintPrice: ethers.utils.parseEther('0.015'),
    initialCouponSigner: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
  },
  overrides: {
    gasPrice: ethers.utils.parseUnits('100', 'gwei'),
    gasLimit: 8000000,
  },
};
