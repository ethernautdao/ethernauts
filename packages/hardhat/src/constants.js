const path = require('path');

const TOTAL_ASSETS = 10000;
const IPFS_PREFIX = 'ipfs://';

const DAPP_FOLDER = path.resolve(__dirname, '..', '..', 'dapp');
const DATA_DAPP_FOLDER = path.join(DAPP_FOLDER, 'data');

const RESOURCES_METADATA_FOLDER =
  process.env.RESOURCES_METADATA_FOLDER || path.join(__dirname, '..', 'resources', 'metadata');
const RESOURCES_ASSETS_FOLDER =
  process.env.RESOURCES_ASSETS_FOLDER || path.join(__dirname, '..', 'resources', 'assets');
const RESOURCES_ORIGINAL_FOLDER =
  process.env.RESOURCES_ORIGINAL_FOLDER || path.join(__dirname, '..', 'resources', 'original');

module.exports = {
  TOTAL_ASSETS,
  IPFS_PREFIX,
  DAPP_FOLDER,
  DATA_DAPP_FOLDER,
  RESOURCES_METADATA_FOLDER,
  RESOURCES_ASSETS_FOLDER,
  RESOURCES_ORIGINAL_FOLDER,
};
