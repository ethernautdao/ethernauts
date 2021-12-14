require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.9',
  defaultNetwork: 'hardhat',
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
    docker: {
      url: 'http://hardhat-node:8545',
    },
  },
};
