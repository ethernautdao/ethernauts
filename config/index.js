require('dotenv').config();

const config = {
  pinningService: {
    name: process.env.PINNING_SERVICE_NAME,
    key: process.env.PINNING_SERVICE_JWT_TOKEN,
    endpoint: process.env.PINNING_SERVICE_ENDPOINT,
  },
  ipfsGatewayUrl: process.env.IPFS_GATEWAY_URL,
  ipfsApiUrl: process.env.IPFS_API_URL,
};

module.exports = config;
