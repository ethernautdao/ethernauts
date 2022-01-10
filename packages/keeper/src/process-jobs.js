const path = require('path');
const fleek = require('./fleek');
const config = require('./config');
const { JOB_PROCESS_BATCH, JOB_UPDATE_BASE_URL, JOB_UPLOAD_RESOURCE } = require('./constants');

const jobs = {
  /**
   * Generate all the necessary jobs for uploading the assets
   */
  [JOB_PROCESS_BATCH]: async function ({ batchId, batchSize }, { Ethernauts }) {
    const randomNumber = await Ethernauts.getRandomNumberForBatch(batchId);
    const offset = Number(randomNumber.mod(batchSize));

    const minTokenIdInBatch = batchSize * batchId;
    const maxTokenIdInBatch = batchSize * (batchId + 1) - 1;

    const children = [];
    for (let tokenId = minTokenIdInBatch; tokenId <= maxTokenIdInBatch; tokenId++) {
      let assetId = tokenId + offset;
      if (assetId > maxTokenIdInBatch) assetId -= batchSize;

      children.push({
        name: JOB_UPLOAD_RESOURCE,
        queueName: config.MINTS_QUEUE_NAME,
        data: { tokenId, assetId },
      });
    }

    console.log(
      JSON.stringify(
        {
          name: JOB_UPLOAD_RESOURCE,
          queueName: config.MINTS_QUEUE_NAME,
          children,
        },
        null,
        2
      )
    );
  },

  /**
   * Upgrade the latest folder uri from IPFS
   */
  [JOB_UPDATE_BASE_URL]: async function (data) {
    // TODO: Call Ethernauts.setBaseURI()
  },

  /**
   * Get a mint process job and upload to necessary asset to IPFS
   */
  [JOB_UPLOAD_RESOURCE]: async function ({ tokenId, assetId }) {
    const metadataKey = `${config.FLEEK_METADATA_FOLDER}/${tokenId}`;
    const assetKey = `${config.FLEEK_ASSETS_FOLDER}/${tokenId}.png`;

    const exists = await fleek.fileExists({
      key: metadataKey,
    });

    if (exists) {
      console.warn(`Resource with tokenId "${tokenId}" already uploaded`);
      return;
    }

    const result = await Promise.all([
      fleek.uploadFile({
        key: metadataKey,
        location: path.join(config.RESOURCES_METADATA_FOLDER, `${assetId}.json`),
      }),
      fleek.uploadFile({
        key: assetKey,
        location: path.join(config.RESOURCES_ASSETS_FOLDER, `${assetId}.png`),
      }),
    ]);

    console.log(`==== Resource Uploaded | tokenId: ${tokenId} ===`);
    console.log(JSON.stringify(result[0]));
    console.log(JSON.stringify(result[1]));
    console.log('================================================');
  },
};

module.exports = function processJobs(ctx) {
  return async function processJob(job) {
    if (!jobs[job.name]) {
      throw new Error(`Invalid job: ${JSON.stringify(job)}`);
    }

    return await jobs[job.name](job.data, ctx);
  };
};
