const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const constants = require('../src/constants');
const fileExists = require('../src/utils/file-exists');

async function main() {
  if (!(await fileExists(path.join(constants.RESOURCES_METADATA_FOLDER, '0.json')))) {
    throw new Error('Metadata files are needed');
  }

  const metadataFiles = (await fs.readdir(constants.RESOURCES_METADATA_FOLDER)).filter(
    (name) => path.extname(name) === '.json'
  );

  const ipfsHashes = await Promise.all(
    metadataFiles.map(async (filename) => {
      const filepath = path.join(constants.RESOURCES_METADATA_FOLDER, filename);
      const metadata = JSON.parse(await fs.readFile(filepath)).image;
      return metadata.slice(constants.IPFS_PREFIX.length);
    })
  );

  const concatenated = ipfsHashes.join('');
  const provenanceHash = crypto.createHash('md5').update(concatenated).digest('hex');

  console.log('=== Concatenated Hashes ===');
  console.log(concatenated);
  console.log('---------------------------');
  console.log('=== Provenance MD5 Hash ===');
  console.log(provenanceHash);
  console.log('---------------------------');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
