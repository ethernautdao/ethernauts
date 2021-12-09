require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.4',
  networks: {
    hardhat: {},
    local: {
      url: 'http://localhost:8545',
    },
    docker: {
      url: 'http://hardhat-node:8545',
    },
  },
};
