const del = require('del');
const path = require('path');
const faker = require('faker');
const fs = require('fs');
const makeDir = require('make-dir');
const Confirm = require('prompt-confirm');

const { getIPFSHash } = require('../src/utils/ipfs-uri');

const RESOURCES_FOLDER = path.resolve(__dirname, '..', 'resources');
const ASSETS_FOLDER = path.join(RESOURCES_FOLDER, 'assets');
const METADATA_FOLDER = path.join(RESOURCES_FOLDER, 'metadata');
const IPFS_PREFIX = 'ipfs://';

function fileExists(file) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function main() {
  if (await fileExists(path.join(METADATA_FOLDER, '0.json'))) {
    const confirm = new Confirm('Do you want to recreate the assets metadata?');
    
    const yes = await confirm.run();

    if (!yes) process.exit();

    await del([METADATA_FOLDER]);
  }

  const assets = await fs.promises.readdir(ASSETS_FOLDER);

  if (!assets.length) throw new Error('Assets are needed');

  await makeDir(METADATA_FOLDER);

  const ipfsHashes = await Promise.all(assets.map((asset) => {
    const filepath = path.join(ASSETS_FOLDER, asset);
    
    const file = fs.readFileSync(filepath);

    return getIPFSHash(file);
  }));

  return Promise.all(assets.map((filename, index) => {
    const metadataPath = path.join(METADATA_FOLDER, `${path.parse(filename).name}.json`);

    const metadata = {
      name: filename,
      image: IPFS_PREFIX + ipfsHashes[index],
      description: faker.hacker.phrase(),
    }

    return fs.promises.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  }));
}

main()
    .then(() => {
        console.log('Assets metadata has been created succesfully');
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });