const path = require('path');
const fs = require('fs/promises');

const constants = require('../src/constants');
const fileExists = require('../src/utils/file-exists');
const { getIPFSHash } = require('../src/utils/ipfs-uri');

async function main() {
  if (!(await fileExists(path.join(constants.RESOURCES_METADATA_FOLDER, '0.json')))) {
    throw new Error('Metadata are needed');
  }
  const assets = await fs.readdir(constants.RESOURCES_ASSETS_FOLDER);

  if (!assets.length) throw new Error('Assets are needed');

  return Promise.all(
    assets.map(async (asset) => {
      const filepath = path.join(constants.RESOURCES_ASSETS_FOLDER, asset);

      const metadataPath = path.join(
        constants.RESOURCES_METADATA_FOLDER,
        `${path.parse(asset).name}.json`
      );

      const [file, metadata] = await Promise.all([
        fs.readFile(filepath),
        fs.readFile(metadataPath),
      ]);

      const ipfsHash = await getIPFSHash(file);

      const metadataWithIpfs = {
        ...JSON.parse(metadata),
        image: constants.IPFS_PREFIX + ipfsHash,
      };

      return fs.writeFile(metadataPath, JSON.stringify(metadataWithIpfs, null, 2));
    })
  );
}

main()
  .then(() => {
    console.log('Assets metadata has been created succesfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
