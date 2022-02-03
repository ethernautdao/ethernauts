const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const constants = require('../src/constants');
const fileExists = require('../src/utils/file-exists');

async function main() {
  if (!(await fileExists(path.join(constants.RESOURCES_METADATA_FOLDER, '0.json')))) {
    throw new Error('Metadata files are needed');
  }

  let ipfsHashes = '';
  for (let i = 0; i < 10000; i++) {
    const filename = path.join(constants.RESOURCES_METADATA_FOLDER, `${i}.json`);
    const filepath = path.join(constants.RESOURCES_METADATA_FOLDER, filename);
    const metadata = JSON.parse(await fs.readFile(filepath)).image;
    ipfsHashes += metadata.slice(constants.IPFS_PREFIX.length);
  }

  const provenanceHash = crypto.createHash('md5').update(ipfsHashes).digest('hex');

  console.log('=== Concatenated Hashes ===');
  console.log(ipfsHashes);
  console.log('---------------------------');
  console.log('=== Provenance MD5 Hash ===');
  console.log(provenanceHash);
  console.log('---------------------------');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
