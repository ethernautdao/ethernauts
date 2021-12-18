const { createReadStream, constants } = require('fs');
const { access } = require('fs/promises');
const fleekStorage = require('@fleekhq/fleek-storage-js');
const config = require('./config');
const path = require('path');

/**
 * Get a mint process job and upload to necessary asset to IPFS
 * @param {Object} job
 * @param {string} job.tokenId
 */
module.exports = async function processMint(job) {
  const exists = await fleekStorage.get({
    apiKey: config.FLEEK_STORAGE_API_KEY,
    apiSecret: config.FLEEK_STORAGE_API_SECRET,
    getOptions: ['hash', 'publicUrl'],
    key: `${config.FLEEK_METADATA_FOLDER}/${job.tokenId}.json`,
  });

  if (exists && exists.hash) {
    throw new Error(`Resource with tokenId "${job.tokenId}" already uploaded`);
  }

  const resources = [
    {
      key: `${config.FLEEK_METADATA_FOLDER}/${job.tokenId}.json`,
      location: path.join(config.RESOURCES_METADATA_FOLDER, `${job.tokenId}.json`),
    },
    {
      key: `${config.FLEEK_ASSETS_FOLDER}/${job.tokenId}.png`,
      location: path.join(config.RESOURCES_ASSETS_FOLDER, `${job.tokenId}.png`),
    },
  ];

  const result = await Promise.all(
    resources.map(async (resource) => {
      await access(resource.location, constants.R_OK);

      return fleekStorage.streamUpload({
        apiKey: config.FLEEK_STORAGE_API_KEY,
        apiSecret: config.FLEEK_STORAGE_API_SECRET,
        key: resource.key,
        stream: createReadStream(resource.location),
      });
    })
  );

  console.log(`==== Job Processed ===
  ${JSON.stringify(job)}
  ${JSON.stringify(result)}
  ======================`);

  console.log('processed: ', JSON.stringify(job));
};
