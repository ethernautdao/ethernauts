const path = require('path');
const fleek = require('./fleek');
const config = require('./config');

/**
 * Get a mint process job and upload to necessary asset to IPFS
 * @param {Object} job
 * @param {string} job.tokenId
 */
module.exports = async function processMint(job) {
  const metadataKey = `${config.FLEEK_METADATA_FOLDER}/${job.tokenId}`;
  const assetKey = `${config.FLEEK_ASSETS_FOLDER}/${job.tokenId}.png`;

  const exists = await fleek.fileExists({
    key: metadataKey,
  });

  if (exists) {
    throw new Error(`Resource with tokenId "${job.tokenId}" already uploaded`);
  }

  const result = await Promise.all([
    fleek.uploadFile({
      key: metadataKey,
      location: path.join(config.RESOURCES_METADATA_FOLDER, `${job.tokenId}.json`),
    }),
    fleek.uploadFile({
      key: assetKey,
      location: path.join(config.RESOURCES_ASSETS_FOLDER, `${job.tokenId}.png`),
    }),
  ]);

  console.log('==== Job Processed ===');
  console.log(JSON.stringify(job));
  console.log(JSON.stringify(result[0]));
  console.log(JSON.stringify(result[1]));
  console.log('======================');
};
