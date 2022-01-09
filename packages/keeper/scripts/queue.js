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

//config.MINTS_QUEUE_NAME,

async function main() {
  const Ethernauts = await getContractFromAbi('Ethernauts');

  const batchSize = await Ethernauts.batchSize();
  console.log(' - Keeper Queue started -');
  console.log(`   Address: ${Ethernauts.address}`);
  console.log(`   BatchSize: ${Number(batchSize)} `);

  Ethernauts.on('BatchEnd', (batchId) => {
    console.log('BatchEnd', { batchId: Number(batchId) });
    // const result = parseMint(...args);

    // if (result) {
    //   const { to, tokenId } = result;
    //   mintsQueue.add('mints', { to, tokenId });
    //   console.log(`Mint detected, tokenId: ${tokenId}`);
    // }
  });

  Ethernauts.on('Transfer', (from, to, tokenId) => {
    console.log('Transfer', { from, to, tokenId: Number(tokenId) });
    // const result = parseMint(...args);

    // if (result) {
    //   const { to, tokenId } = result;
    //   mintsQueue.add('mints', { to, tokenId });
    //   console.log(`Mint detected, tokenId: ${tokenId}`);
    // }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
