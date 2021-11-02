const path = require('path');

const TOTAL_ASSETS = 10000;
const IPFS_PREFIX = 'ipfs://';
const RESOURCES_FOLDER = path.resolve(__dirname, '..', 'resources');
const ASSETS_FOLDER = path.join(RESOURCES_FOLDER, 'assets');
const METADATA_FOLDER = path.join(RESOURCES_FOLDER, 'metadata');

module.exports = {
  TOTAL_ASSETS,
  IPFS_PREFIX,
  RESOURCES_FOLDER,
  ASSETS_FOLDER,
  METADATA_FOLDER,
};
