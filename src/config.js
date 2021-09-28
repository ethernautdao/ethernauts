const { cleanEnv, str } = require('envalid');

require('dotenv').config();

module.exports = cleanEnv(process.env, {
  PINNING_SERVICE_NAME: str(),
  PINNING_SERVICE_KEY: str(),
  PINNING_SERVICE_ENDPOINT: str(),
  IPFS_GATEWAY_URL: str(),
  IPFS_API_URL: str(),
});
