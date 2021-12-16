const { Queue } = require('bullmq');
const { getContractFromAbi } = require('@ethernauts/hardhat/src/utils/hardhat');
const config = require('../src/config');

const mintsQueue = new Queue(config.MINTS_QUEUE_NAME, {
  connection: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

async function main() {
  const Ethernauts = await getContractFromAbi('Ethernauts');

  const batchSize = await Ethernauts.batchSize();

  console.log({ batchSize });

  console.log(`Listening for events on Ethernauts token at ${Ethernauts.address}`);

  Ethernauts.on('Transfer', async (from, to, amount, evt) => {
    if (from !== '0x0000000000000000000000000000000000000000') return;
    const tokenId = evt.args.tokenId.toString();
    console.log(`Mint detected, tokenId: ${tokenId}`);
    mintsQueue.add('mints', { tokenId, to, amount });
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
