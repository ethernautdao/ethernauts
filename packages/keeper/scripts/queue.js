const { FlowProducer } = require('bullmq');
const { getContractFromAbi } = require('@ethernauts/hardhat/src/utils/hardhat');
const config = require('../src/config');
const { JOB_BATCH_END } = require('../src/constants');

const mintsFlow = new FlowProducer({
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
    const batchId = Math.floor(tokenId / batchSize);
    const maxTokenIdInBatch = batchSize * (batchId + 1) - 1;

    console.log('Transfer:', JSON.stringify({ to, tokenId }));

    if (tokenId == maxTokenIdInBatch) {
      console.log('BatchEnd:', JSON.stringify({ batchId, maxTokenIdInBatch }));

      await mintsFlow.add({
        name: JOB_BATCH_END,
        queueName: config.MINTS_QUEUE_NAME,
        data: {
          batchId,
          batchSize,
        },
      });
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
