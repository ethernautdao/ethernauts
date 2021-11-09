const path = require('path');
const fastq = require('fastq');

const { getContractAt } = require('@ethernauts/hardhat/src/utils/hardhat');
const IPFS = require('@ethernauts/hardhat/src/ipfs');
const config = require('@ethernauts/hardhat/src/config');
const constants = require('@ethernauts/hardhat/src/constants');

async function main() {
  const ipfs = new IPFS({
    pinningService: {
      name: config.PINNING_SERVICE_NAME,
      key: config.PINNING_SERVICE_KEY,
      endpoint: config.PINNING_SERVICE_ENDPOINT,
    },
    ipfsGatewayUrl: config.IPFS_GATEWAY_URL,
    ipfsApiUrl: config.IPFS_API_URL,
  });

  const Ethernauts = await getContractAt('Ethernauts');

  async function uploadResource(tokenId) {
    // TODO: Check if image already exists on ipfs

    // Upload to local ipfs node
    const resultFromLocalIpfsNode = await ipfs.uploadToLocalIpfsNodeFromAssetFile(
      path.join(constants.ASSETS_FOLDER, `${tokenId}.png`),
      {
        name: `${tokenId}.png`,
        description: 'This is an example',
      }
    );

    console.log('resultFromLocalIpfsNode', resultFromLocalIpfsNode);
  }

  const queue = fastq.promise(uploadResource, config.MINTS_QUEUE_COCURRENCY);

  const oldEvents = await Ethernauts.queryFilter('Transfer');

  const proccesed = oldEvents
    .map((evt) => {
      if (evt.args.from !== '0x0000000000000000000000000000000000000000') return;
      return evt.args.tokenId.toString();
    })
    .filter((tokenId) => !!tokenId);

  console.log(`Listening for events on Ethernauts token at ${Ethernauts.address}`);

  Ethernauts.on('Transfer', async (from, to, amount, evt) => {
    if (from !== '0x0000000000000000000000000000000000000000') return;
    const tokenId = evt.args.tokenId.toString();
    if (proccesed.includes(tokenId)) return;
    console.log(`Mint detected, tokenId: ${tokenId}`);
    await queue.push(tokenId);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
