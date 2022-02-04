const assert = require('assert');
const { ethers } = require('hardhat');

describe('Reveal', () => {
  let Ethernauts;
  let owner, user;

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaultParameters));
  });

  describe('when first batch of Ethernauts arrive to destination', () => {
    before('open the sale', async () => {
      await (await Ethernauts.connect(owner).setSaleState(2)).wait();
    });

    before(async () => {
      const batchSize = (await Ethernauts.batchSize()).toNumber();
      const firstBatchMintedPlusTwo = batchSize + 2;

      let promises = [];
      for (let i = 0; i < firstBatchMintedPlusTwo; i++) {
        promises.push(
          (
            await Ethernauts.connect(user).mint({
              value: ethers.utils.parseEther('0.2'),
            })
          ).wait()
        );
      }

      await Promise.all(promises);
    });

    it('should reveal the first batch of Ethernauts', async () => {
      const batchSize = (await Ethernauts.batchSize()).toNumber();
      const randomFirstBatchTokenId = Math.floor(Math.random() * batchSize);

      assert.equal(await Ethernauts.isTokenRevealed(randomFirstBatchTokenId), true);
    });

    it('should not reveal the second batch of Ethernauts', async () => {
      const batchSize = (await Ethernauts.batchSize()).toNumber();
      assert.equal(await Ethernauts.isTokenRevealed(batchSize), false);
    });
  });
});
