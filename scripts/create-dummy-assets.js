const fs = require('fs').promises;
const PNGlib = require('node-pnglib');
const Confirm = require('prompt-confirm');
const randomColor = require('random-color');

const TOTAL_ASSETS = 10000;
const ASSETS_FOLDER = 'assets/';

const hasFiles = async (folder) => {
  return (await fs.readdir(folder).length) != 0;
};

const createSampleAssets = async () => {
  if (await hasFiles('assets/')) {
    const confirm = new Confirm('Do you want to recreate the assets?');

    const answer = await confirm.run();

    if (!answer) process.exit(0);
  }

  for (let x = 0; x < TOTAL_ASSETS; x++) {
    let png = new PNGlib(150, 150);

    const color = randomColor().hexString();

    for (let i = 20; i < 100; i++) {
      for (let j = 20; j < 100; j++) {
        png.setPixel(i + 10, j + 20, color);
      }
    }

    await fs.writeFile(ASSETS_FOLDER + x + '.png', png.getBuffer());
  }
};

createSampleAssets()
  .then(() => console.log('Dummy assets has been created!'))
  .catch(console.error);
