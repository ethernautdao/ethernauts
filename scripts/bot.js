const fs = require('fs');
const hre = require('hardhat');

const config = require('../config');

const IPFS = require('../ipfs');

const { ethers } = hre;

async function main() {
  const ipfs = new IPFS(config.ipfsApiUrl, config.ipfsGatewayUrl, config.pinningService);

  const deploymentPath = `./deployments/${hre.network.name}.json`;

  const data = _loadDeploymentFile(deploymentPath);

  if (!data.token || data.token === '') {
    throw new Error('No token data found');
  }

  const Ethernauts = await ethers.getContractAt('Ethernauts', data.token);

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
        `assets/${tokenId}.png`,
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

// function _checkIfTokenIdAssetExists(tokenId) {
//   // TODO
// }

// function _updateLocalAssetIdWithTokenId() {
//   // TODO
// }

// function _randomlySelectAssetId() {
//   // TODO
// }

// async function _uploadToIPFS({ tokenId, assetId }) {
//   // TODO
// }

function _loadDeploymentFile(filepath) {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath));
  } else {
    throw new Error(`${filepath} not found`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });