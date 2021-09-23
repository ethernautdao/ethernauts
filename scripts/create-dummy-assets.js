const fs = require('fs');
const del = require('del');
const path = require('path');
const random = require('random');
const makeDir = require('make-dir');
const PNGlib = require('node-pnglib');
const Confirm = require('prompt-confirm');
const randomColor = require('random-color');

const TOTAL_ASSETS = 10000;
const RESOURCES_FOLDER = path.resolve(__dirname, '..', 'resources');
const ASSETS_FOLDER = path.join(RESOURCES_FOLDER, 'assets');
const METADATA_FOLDER = path.join(RESOURCES_FOLDER, 'metadata');

function fileExists(file) {
  return fs.promises
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function main() {
  if (await fileExists(path.join(ASSETS_FOLDER, '0.png'))) {
    const confirm = new Confirm('Do you want to recreate the assets?');
    const yes = await confirm.run();
    if (!yes) return;
    await del([ASSETS_FOLDER]);
  }

  await makeDir(ASSETS_FOLDER);

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

    rarities.push(getRarity());

    const assetPath = path.join(ASSETS_FOLDER, `${x}.png`);

    promises.push(fs.promises.writeFile(assetPath, png.getBuffer()));
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

  distribution.forEach((count, i) => {
    const from = `0.${`${i}`.padEnd(1, '0')}`;
    const to = i + 1 >= 10 ? '1.0' : `0.${`${i + 1}`.padEnd(1, '0')}`;
    console.log(`  [${from}-${to}): ${count} assets`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
