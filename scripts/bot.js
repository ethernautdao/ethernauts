const fs = require('fs');
const hre = require('hardhat');

const { IpfsForEthernaut } = require('../ipfs');

const { ethers } = hre;

async function main() {
  const ipfsForEthernaut = new IpfsForEthernaut();

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

      // Upload to ipfs local node
      const resultFromIpfsLocalNode = await ipfsForEthernaut.uploadToLocalIpfsNodeFromAssetFile(
        `assets/${tokenId}.png`,
        {
          name: `${tokenId}.png`,
          description: 'This is an example',
        }
      );

      console.log('resultFromIpfsLocalNode', resultFromIpfsLocalNode);

      // Upload asset and metadata to pinata
      await Promise.all([
        ipfsForEthernaut.pin(resultFromIpfsLocalNode.assetURI),
        ipfsForEthernaut.pin(resultFromIpfsLocalNode.metadataURI),
      ]);
    }
  });

  await new Promise(() => {});
}

function _checkIfTokenIdAssetExists(tokenId) {
  // TODO
}

function _randomlySelectAssetId() {
  // TODO
}

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
