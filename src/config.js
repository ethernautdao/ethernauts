const path = require('path');
const { cleanEnv, str } = require('envalid');

require('dotenv').config();

const envs = cleanEnv(process.env, {
  PINNING_SERVICE_NAME: str(),
  PINNING_SERVICE_KEY: str(),
  PINNING_SERVICE_ENDPOINT: str(),
  IPFS_GATEWAY_URL: str(),
  IPFS_API_URL: str(),
});

const TOTAL_ASSETS = 10000;
const IPFS_PREFIX = 'ipfs://';
const RESOURCES_FOLDER = path.resolve(__dirname, '..', 'resources');
const ASSETS_FOLDER = path.join(RESOURCES_FOLDER, 'assets');
const METADATA_FOLDER = path.join(RESOURCES_FOLDER, 'metadata');

module.exports = {
  ...envs,
  IPFS_PREFIX,
  TOTAL_ASSETS,
  ASSETS_FOLDER,
  METADATA_FOLDER,
};
