require('../src/errors-catch');

const { FlowProducer, Worker } = require('bullmq');
const { getContractFromAbi } = require('@ethernauts/hardhat/src/utils/hardhat');
const config = require('../src/config');
const notify = require('../src/notify');
const processJobs = require('../src/process-jobs');

async function main() {
  const Ethernauts = await getContractFromAbi('Ethernauts');

  const queue = new FlowProducer({
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
  });

  const ctx = { Ethernauts, queue };

  const worker = new Worker(config.MINTS_QUEUE_NAME, processJobs(ctx), {
    concurrency: config.MINTS_QUEUE_CONCURRENCY,
    connection: {
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
    },
  });

  worker
    .on('completed', (job) => console.log('completed: ', JSON.stringify(job)))
    .on('error', (error) => {
      notify.error({
        message: 'Worker Job Error',
        error,
      });
    })
    .on('failed', (job) => console.log('failed: ', JSON.stringify(job)));

  await worker.waitUntilReady();

  console.log(' - Keeper Jobs Started - ');
}

main();
