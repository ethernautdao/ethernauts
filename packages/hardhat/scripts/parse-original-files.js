const path = require('path');
const fs = require('fs/promises');

const K = require('../src/constants');
const { getIPFSHash } = require('../src/utils/ipfs-uri');

async function main() {
  const filenames = (await fs.readdir(K.RESOURCES_ORIGINAL_FOLDER)).filter(
    (name) => path.extname(name) === '.png'
  );

  for (const filename of filenames) {
    if (!/^[0-9]+(_[a-z\s]+-[a-z\s]+)+\.png$/.test(filename)) {
      throw new Error(`Invalid filename "${filename}"`);
    }
  }

  let done = 0;
  process.stdout.write(`${done}/${filenames.length}`);

  await Promise.all(
    filenames.map(async (filename) => {
      const [assetId, ...attrValues] = path.basename(filename, '.png').split('_');

      const attributes = attrValues.reduce((attrs, curr) => {
        const [trait_type, value] = curr.split('-');

        if (value !== 'null') {
          attrs.push({ trait_type, value });
        }

        return attrs;
      }, []);

      const originalPath = path.join(K.RESOURCES_ORIGINAL_FOLDER, filename);
      const metadataPath = path.join(K.RESOURCES_METADATA_FOLDER, `${assetId}.json`);
      const assetPath = path.join(K.RESOURCES_ASSETS_FOLDER, `${assetId}.png`);

      const originalFile = await fs.readFile(originalPath);
      const ipfsHash = await getIPFSHash(originalFile);

      const metadata = {
        name: `EthernautDAO #${assetId}`,
        description: 'EthernautDAO governance NFT',
        external_url: `https://mint.ethernautdao.io/assets/${assetId}`,
        image: K.IPFS_PREFIX + ipfsHash,
        attributes,
      };

      await Promise.all([
        fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2)),
        fs.rename(originalPath, assetPath),
      ]);

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${++done}/${filenames.length}`);
    })
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
