const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const { getIPFSHash } = require('../src/utils/ipfs-uri');

const FOLDER = process.argv[2];

async function main() {
  const assets = (await fs.readdir(FOLDER))
    .filter((name) => path.extname(name) === '.png')
    .sort((a, b) => {
      const [nA] = a.split('_');
      const [nB] = b.split('_');

      const nnA = Number(nA);
      const nnB = Number(nB);
      if (nnA === nnB) {
        throw new Error('Same asset ids');
      }

      return nnA < nnB ? -1 : 1;
    });

  console.log(`Generating Provenance Hash for ${assets.length} files.`);

  const ipfsHashes = [];
  for (let assetId = 0; assetId < assets.length; assetId++) {
    const filepath = assets[assetId];

    console.log(filepath);

    if (assetId > 0) {
      const [currAssetId] = assets[assetId].split('_');
      const [prevAssetId] = assets[assetId - 1].split('_');
      if (Number(currAssetId) - Number(prevAssetId) !== 1) {
        throw new Error('Invalid asset ids');
      }
    }

    const file = await fs.readFile(path.join(FOLDER, filepath));
    ipfsHashes.push(await getIPFSHash(file));
  }

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
