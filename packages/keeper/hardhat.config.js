require('@nomiclabs/hardhat-ethers');
require('hardhat-dependency-compiler');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    local: {
      url: 'http://localhost:8545',
    },
  },
  dependencyCompiler: {
    paths: [
      '@ethernauts/hardhat/contracts/Ethernauts.sol',
    ],
  }
};
