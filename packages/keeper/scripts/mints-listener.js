const { Queue } = require('bullmq');
const { getContractAt } = require('@ethernauts/hardhat/src/utils/hardhat');

/*
TODO

* Listen to mints (event 'Transfer')
  + If its the start of a new batch, Call as owner to `Ethernauts.setNextRandomNumber()`

* Listen to batch start event (event 'BatchStart')
  + For each asset from the previous batch, enqueue the upload of the resources

* Create the script to upload resources pending on the queue

*/

async function main() {
  const Ethernauts = await getContractAt('Ethernauts');

  const batchSize = await Ethernauts.batchSize();

  console.log(`Listening for events on Ethernauts token at ${Ethernauts.address}`);

  Ethernauts.on('Transfer', async (from, to, amount, evt) => {
    if (from !== '0x0000000000000000000000000000000000000000') return;
    const tokenId = evt.args.tokenId.toString();
    console.log(`Mint detected, tokenId: ${tokenId}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
