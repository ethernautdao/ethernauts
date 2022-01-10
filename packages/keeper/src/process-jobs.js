const path = require('path');
const fleek = require('./fleek');
const config = require('./config');
const { JOB_BATCH_END, JOB_BATCH_URL_UPDATE, JOB_UPLOAD_RESOURCE } = require('./constants');

const jobs = {
  /**
   * Generate all the necessary jobs for uploading the assets
   */
  [JOB_BATCH_END]: async function ({ batchId, batchSize }, { Ethernauts }) {
    const randomNumber = Number(await Ethernauts.getRandomNumberForBatch(batchId));
    const minTokenIdInBatch = batchSize * batchId;

    const children = Array.from(Array(batchSize)).map((_, i) => ({
      name: JOB_UPLOAD_RESOURCE,
      queueName: config.MINTS_QUEUE_NAME,
      data: { tokenId: minTokenIdInBatch + i, randomNumber },
    }));

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
  [JOB_BATCH_URL_UPDATE]: async function (data) {
    // TODO: Call Ethernauts.setBaseURI()
  },

  /**
   * Get a mint process job and upload to necessary asset to IPFS
   */
  [JOB_UPLOAD_RESOURCE]: async function ({ tokenId }) {
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
        location: path.join(config.RESOURCES_METADATA_FOLDER, `${tokenId}.json`),
      }),
      fleek.uploadFile({
        key: assetKey,
        location: path.join(config.RESOURCES_ASSETS_FOLDER, `${tokenId}.png`),
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
