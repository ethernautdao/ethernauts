const fs = require('fs');
const path = require('path');
const del = require('del');
const random = require('random');
const PNGlib = require('node-pnglib');
const Confirm = require('prompt-confirm');
const randomColor = require('random-color');
const faker = require('faker');

const TOTAL_ASSETS = 10000;
const ASSETS_FOLDER = path.resolve(__dirname, '..', 'assets');

function fileExists(file) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

const createDummyAssets = async () => {
  if (await fileExists(path.join(ASSETS_FOLDER, '0.png'))) {
    const confirm = new Confirm('Do you want to recreate the assets?');
    const answer = await confirm.run();
    if (!answer) process.exit(0);
    await del([path.join(ASSETS_FOLDER, '*.png')]);
  }

  const _r = random.exponential(10.1);
  const getRarity = () => {
    let n = _r();
    return n > 1 ? getRarity() : n;
  };

  const promises = [];
  let rarities = [];

  for (let x = 0; x < TOTAL_ASSETS; x++) {
    let png = new PNGlib(150, 150);

    const color = randomColor().hexString();
    const [min, max] = [random.int(0, 74), random.int(75, 150)];

    for (let i = min; i < max; i++) {
      for (let j = min; j < max; j++) {
        png.setPixel(i, j, color);
      }
    }

    const metadata = {
      name: faker.hacker.adjective(),
      description: faker.hacker.phrase(),
      rarity: getRarity(),
    };

    rarities.push(metadata.rarity);

    const assetPath = path.join(ASSETS_FOLDER, `${x}.png`);
    const metadataPath = path.join(ASSETS_FOLDER, `${x}.json`);

    promises.push(
      fs.promises.writeFile(assetPath, png.getBuffer()),
      fs.promises.writeFile(metadataPath, JSON.stringify(metadata, null, 2))
    );
  }

  await Promise.all(promises);

  rarities = rarities.sort();

  const distribution = [
    ...rarities.reduce((d, rarity) => {
      const i = Math.floor(rarity * 10);
      d[i] = (d[i] || 0) + 1;
      return d;
    }, []),
  ].map((v) => v || 0);

  const title = ` Generated ${TOTAL_ASSETS} assets `;

  console.log('');
  console.log(title.replace(/.{1}/g, '='));
  console.log(title);
  console.log(title.replace(/.{1}/g, '='));
  console.log('');
  console.log(`Min rarity: ${rarities[0]}`);
  console.log(`Max rarity: ${rarities[rarities.length - 1]}`);
  console.log('');
  console.log('Rarity distribution: ');

  distribution.forEach((count, i, a) => {
    const from = `0.${`${i}`.padEnd(1, '0')}`;
    const to = i + 1 >= 10 ? '1.0' : `0.${`${i + 1}`.padEnd(1, '0')}`;
    console.log(`  [${from}-${to}): ${count} assets`);
  });
};

createDummyAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
