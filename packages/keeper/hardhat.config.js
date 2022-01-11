require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    local: {
      url: 'http://localhost:8545',
    },
    docker: {
      url: 'http://hardhat-node:8545',
    },
  },
};
