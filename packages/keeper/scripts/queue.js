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

  console.log({ batchSize });

  console.log(`Listening for events on Ethernauts token at ${Ethernauts.address}`);

  Ethernauts.on('BatchEnd', (...args) => {
    console.log('BatchEnd', ...args);
    // const result = parseMint(...args);

    // if (result) {
    //   const { to, tokenId } = result;
    //   mintsQueue.add('mints', { to, tokenId });
    //   console.log(`Mint detected, tokenId: ${tokenId}`);
    // }
  });

  Ethernauts.on('Transfer', (...args) => {
    console.log('Transfer', ...args);
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
