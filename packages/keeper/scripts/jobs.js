const { Worker } = require('bullmq');
const { getContractFromAbi } = require('@ethernauts/hardhat/src/utils/hardhat');
const config = require('../src/config');
const processJobs = require('../src/process-jobs');

async function main() {
  const ctx = {};

  ctx.Ethernauts = await getContractFromAbi('Ethernauts');

  const worker = new Worker(config.MINTS_QUEUE_NAME, processJobs(ctx), {
    concurrency: config.MINTS_QUEUE_CONCURRENCY,
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
  });

  worker
    .on('completed', (job) => console.log('completed: ', JSON.stringify(job)))
    .on('error', (err) => console.error(err))
    .on('failed', (job) => console.log('failed: ', JSON.stringify(job)));

  await worker.waitUntilReady();

  console.log(' - Keeper Jobs Started - ');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
