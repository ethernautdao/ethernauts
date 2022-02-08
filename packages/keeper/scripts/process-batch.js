require('../src/errors-catch');

const { FlowProducer } = require('bullmq');
const { getContractFromAbi } = require('@ethernauts/hardhat/src/utils/hardhat');
const config = require('../src/config');
const { JOB_PROCESS_BATCH } = require('../src/constants');

const queue = new FlowProducer({
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

async function main() {
  const batchNumber = Number(process.env.BATCH_ID);

  const Ethernauts = await getContractFromAbi('Ethernauts');

  console.log(' - Enqueueing Re Process Batch Job -');
  console.log(`   Address: ${Ethernauts.address}`);

  const batchSize = Number(await Ethernauts.batchSize());
  const maxTokens = Number(await Ethernauts.maxTokens());
  const maxBatchNumber = Math.floor(maxTokens / batchSize) - 1;

  if (!/^[0-9]+$/.test(batchNumber) || batchNumber > maxBatchNumber) {
    throw new Error(`Invalid batch number ${batchNumber}`);
  }

  console.log(`   maxTokens: ${batchSize} `);
  console.log(`   BatchSize: ${batchSize} `);
  console.log(`   maxBatchNumber: ${batchSize} `);

  await queue.add({
    name: JOB_PROCESS_BATCH,
    queueName: config.MINTS_QUEUE_NAME,
    data: {
      batchNumber,
      batchSize,
    },
  });
}

main();
