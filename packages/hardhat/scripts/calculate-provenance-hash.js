const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const { getIPFSHash } = require('../src/utils/ipfs-uri');

const FOLDER = process.argv[2];

async function main() {
  const assets = (await fs.readdir(FOLDER)).filter((name) => path.extname(name) === '.png');

  console.log(`Generating Provenance Hash for ${assets.length} files.`);

  let done = 0;
  process.stdout.write(`${done}/${assets.length}`);
  const ipfsHashes = await Promise.all(
    assets.map(async (filepath) => {
      const file = await fs.readFile(path.join(FOLDER, filepath));
      const ipfsHash = await getIPFSHash(file);

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${++done}/${assets.length}`);

      return ipfsHash;
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
