const path = require('path');
const hre = require('hardhat');

const IPFS = require('../src/ipfs');
const config = require('../config');

const { ethers } = hre;

async function main() {
  const ipfs = new IPFS(config.ipfsApiUrl, config.ipfsGatewayUrl, config.pinningService);

  const { token } = require(`../deployments/${hre.network.name}`);

  if (!token) throw new Error('No token data found');

  const Ethernauts = await ethers.getContractAt('Ethernauts', token);

  console.log(`Listening for events on Ethernauts token at ${Ethernauts.address}`);

  Ethernauts.on('Transfer', async (from, to, amount, event) => {
    if (from === '0x0000000000000000000000000000000000000000') {
      const tokenId = event.args.tokenId.toString();

      console.log(`Mint detected, tokenId: ${tokenId}`);

      /*
        TODO: randomly select assets
      */

      // Upload to local ipfs node
      const resultFromLocalIpfsNode = await ipfs.uploadToLocalIpfsNodeFromAssetFile(
        path.resolve(__dirname, '..', 'resources', 'assets', `${tokenId}.png`),
        {
          name: `${tokenId}.png`,
          description: 'This is an example',
        }
      );

      // Upload asset and metadata to pinata
      await Promise.all([
        ipfs.pin(resultFromLocalIpfsNode.assetURI),
        ipfs.pin(resultFromLocalIpfsNode.metadataURI),
      ]);

      console.log('resultFromLocalIpfsNode', resultFromLocalIpfsNode);
    }
  });

  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
