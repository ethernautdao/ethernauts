const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Random', () => {
  let Ethernauts;

  let owner;

  const maxTokens = 40;
  const batchSize = 20;

  const baseURI = 'http://deadpine.io/';

  before('identify signers', async () => {
    [owner] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = Object.assign({}, hre.config.defaults);
    params.maxTokens = maxTokens;
    params.batchSize = batchSize;
    params.maxGiftable = 0;

    Ethernauts = await factory.deploy(...Object.values(params));
  });

  before('set base URI', async () => {
    await (await Ethernauts.connect(owner).setBaseURI(baseURI)).wait();
  });

  before('open the sale', async () => {
    await (await Ethernauts.connect(owner).setSaleState(2)).wait();
  });

  function simulateRandomNumber(factor) {
    const rand = ethers.BigNumber.from(Math.floor(batchSize * factor));

    return rand;
  }

  async function mintTokens(num) {
    let value = ethers.utils.parseEther('0.2');

    for (let i = 0; i < num; i++) {
      await (await Ethernauts.connect(owner).mint({ value })).wait();
    }
  }

  describe('as the first tokens are minted', () => {
    before('mint some tokens', async () => {
      await mintTokens(3);
    });

    it('shows that the token supply increased accordingly', async () => {
      assert.equal(await Ethernauts.totalSupply(), 3);
    });

    it('shows the temporary URI for all minted tokens', async () => {
      assert.equal(await Ethernauts.tokenURI(0), `${baseURI}travelling_to_destination`);
      assert.equal(await Ethernauts.tokenURI(1), `${baseURI}travelling_to_destination`);
      assert.equal(await Ethernauts.tokenURI(2), `${baseURI}travelling_to_destination`);
    });

    describe('when the owner tries to generate a random number for the current batch, before all its tokens are minted', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(owner).setRandomNumberForBatch(0, 1337),
          'Cannot set for unminted tokens'
        );
      });
    });

    describe('when all the tokens in the batch are minted', () => {
      before('mint some tokens', async () => {
        await mintTokens(17);
      });

      it('shows that the token supply increased accordingly', async () => {
        assert.equal(await Ethernauts.totalSupply(), 20);
      });

      describe('when the random number for the current batch is set', () => {
        let rand;

        before('set random number for batch', async () => {
          rand = simulateRandomNumber(0.5);

          await (await Ethernauts.connect(owner).setRandomNumberForBatch(0, rand)).wait();
        });

        it('shows that the random number is set', async () => {
          assert.equal((await Ethernauts.getRandomNumberForBatch(0)).toString(), rand);
        });

        it('shows the definitive URI for all minted tokens', async () => {
          assert.equal(await Ethernauts.tokenURI(0), `${baseURI}10`);
          assert.equal(await Ethernauts.tokenURI(5), `${baseURI}15`);
          assert.equal(await Ethernauts.tokenURI(10), `${baseURI}0`);
          assert.equal(await Ethernauts.tokenURI(15), `${baseURI}5`);
          assert.equal(await Ethernauts.tokenURI(19), `${baseURI}9`);
        });

        describe('when the owner tries to set the random number for the past batch again', () => {
          it('reverts', async () => {
            await assertRevert(
              Ethernauts.connect(owner).setRandomNumberForBatch(0, 1337),
              'Random number already set'
            );
          });
        });

        describe('when the owner tries to set the random number for the next batch before its tokens are minted', () => {
          it('reverts', async () => {
            await assertRevert(
              Ethernauts.connect(owner).setRandomNumberForBatch(1, 1337),
              'Cannot set for unminted tokens'
            );
          });
        });

        describe('when the tokens for the next batch are minted', () => {
          before('mint some tokens', async () => {
            await mintTokens(20);
          });

          it('shows that the token supply increased accordingly', async () => {
            assert.equal(await Ethernauts.totalSupply(), 40);
          });

          describe('before the owner mints the new random number', () => {
            it('shows the temporary URI for all minted tokens', async () => {
              assert.equal(await Ethernauts.tokenURI(20), `${baseURI}travelling_to_destination`);
              assert.equal(await Ethernauts.tokenURI(21), `${baseURI}travelling_to_destination`);
              assert.equal(await Ethernauts.tokenURI(22), `${baseURI}travelling_to_destination`);
            });
          });

          describe('when the owner creates the new random number', () => {
            before('set random number for batch', async () => {
              rand = simulateRandomNumber(0.1);

              await (await Ethernauts.connect(owner).setRandomNumberForBatch(1, rand)).wait();
            });

            it('shows that the random number is set', async () => {
              assert.equal((await Ethernauts.getRandomNumberForBatch(1)).toString(), rand);
            });

            it('shows the definitive URI for all minted tokens', async () => {
              assert.equal(await Ethernauts.tokenURI(20), `${baseURI}22`);
              assert.equal(await Ethernauts.tokenURI(25), `${baseURI}27`);
              assert.equal(await Ethernauts.tokenURI(30), `${baseURI}32`);
              assert.equal(await Ethernauts.tokenURI(35), `${baseURI}37`);
              assert.equal(await Ethernauts.tokenURI(39), `${baseURI}21`);
            });

            it('shows that all assetIds are used and are unique', async () => {
              const uris = [];

              for (let i = 0; i < maxTokens; i++) {
                const tokenURI = await Ethernauts.tokenURI(i);
                uris.push(tokenURI);
              }
              assert.equal(uris.length, 40);

              const uriSet = new Set(uris);
              assert.equal(uriSet.size, 40);
            });
          });
        });
      });
    });
  });
});
