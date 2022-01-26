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
  const Ethernauts = await getContractFromAbi('Ethernauts');

  console.log(' - Keeper Queue Started -');
  console.log(`   Address: ${Ethernauts.address}`);

  const batchSize = Number(await Ethernauts.batchSize());

  console.log(`   BatchSize: ${batchSize} `);

  Ethernauts.on('Transfer', async (from, to, tokenId) => {
    if (from !== '0x0000000000000000000000000000000000000000') return;

    tokenId = Number(tokenId);
    const batchNumber = Math.floor(tokenId / batchSize);
    const maxTokenIdInBatch = batchSize * (batchNumber + 1) - 1;

    console.log('Transfer:', JSON.stringify({ to, tokenId }));

    if (tokenId == maxTokenIdInBatch) {
      console.log('BatchEnd:', JSON.stringify({ batchNumber, maxTokenIdInBatch }));

      await queue.add({
        name: JOB_PROCESS_BATCH,
        queueName: config.MINTS_QUEUE_NAME,
        data: {
          batchNumber,
          batchSize,
        },
      });
    }
  });
}

main();
