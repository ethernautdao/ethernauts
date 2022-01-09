const { FlowProducer } = require('bullmq');
const { getContractFromAbi } = require('@ethernauts/hardhat/src/utils/hardhat');
const config = require('../src/config');
const parseMint = require('../src/parse-mint');

const mintsFlow = new FlowProducer({
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

async function main() {
  const Ethernauts = await getContractFromAbi('Ethernauts');

  console.log(' - Keeper Queue started -');
  console.log(`   Address: ${Ethernauts.address}`);

  const batchSize = Number(await Ethernauts.batchSize());

  console.log(`   BatchSize: ${batchSize} `);

  Ethernauts.on('Transfer', (from, to, tokenId) => {
    if (from !== '0x0000000000000000000000000000000000000000') return;

    tokenId = Number(tokenId);
    const currentBatchId = Math.floor(tokenId / batchSize);
    const maxTokenIdInBatch = batchSize * (currentBatchId + 1) - 1;

    console.log('Transfer', { from, to, tokenId });

    if (tokenId == maxTokenIdInBatch) {
      console.log('Batch end: ', { currentBatchId, maxTokenIdInBatch });
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
