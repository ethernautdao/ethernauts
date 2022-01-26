const assert = require('assert');
const { ethers } = require('hardhat');
const assertRevert = require('./utils/assertRevert');

describe('Random', () => {
  let Ethernauts;

  let owner, user;

  const maxTokens = 100;
  const batchSize = 10;

  const baseURI = 'http://deadpine.io/';

  async function mintTokens(num) {
    const value = ethers.utils.parseEther('0.2');

    for (let i = 0; i < num; i++) {
      await (await Ethernauts.connect(owner).mint({ value })).wait();
    }
  }

  function calculateAssetId(tokenId, randomNumber) {
    const batchNumber = Math.floor(tokenId / batchSize);
    const offset = randomNumber.mod(ethers.BigNumber.from(batchSize)).toNumber();
    const maxTokenIdInBatch = batchSize * (batchNumber + 1) - 1;

    let assetId = tokenId + offset;
    if (assetId > maxTokenIdInBatch) {
      assetId -= batchSize;
    }

    return assetId;
  }

  async function validateTokenUri(tokenId, randomNumber) {
    const { assetId } = await Ethernauts.getAssetIdForTokenId(tokenId);
    const calculatedAssetId = calculateAssetId(tokenId, randomNumber);
    assert.equal(assetId, calculatedAssetId);

    const fromContract = await Ethernauts.tokenURI(tokenId);
    const expected = `${baseURI}${calculatedAssetId}`;
    assert.equal(fromContract, expected);
  }

  async function validateTempTokenUri(tokenId) {
    const { assetAvailable } = await Ethernauts.getAssetIdForTokenId(tokenId);
    assert.equal(assetAvailable, false);

    const fromContract = await Ethernauts.tokenURI(tokenId);
    const expected = `${baseURI}travelling_to_destination`;

    assert.equal(fromContract, expected);
  }

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = { ...hre.config.defaults };
    params.definitiveMaxGiftableTokens = 0;
    params.definitiveMaxTokens = maxTokens;
    params.definitiveBatchSize = batchSize;

    Ethernauts = await factory.deploy(...Object.values(params));
  });

  before('set base URI', async () => {
    await (await Ethernauts.connect(owner).setBaseURI(baseURI)).wait();
  });

  before('open the sale', async () => {
    await (await Ethernauts.connect(owner).setSaleState(2)).wait();
  });

  describe('when a non-owner account attempts to generate a random number', function () {
    it('reverts', async function () {
      await assertRevert(
        Ethernauts.connect(user).generateRandomNumber(),
        'caller is not the owner'
      );
    });
  });

  describe('when querying batch numbers', function () {
    it('responds with the expected values', async function () {
      assert.equal((await Ethernauts.getBatchForToken(0)).toNumber(), 0);
      assert.equal((await Ethernauts.getBatchForToken(2 * batchSize)).toNumber(), 2);
      assert.equal((await Ethernauts.getBatchForToken(42 * batchSize)).toNumber(), 42);
    });
  });

  describe('when querying max token ids in batches', function () {
    it('responds with the expected values', async function () {
      assert.equal((await Ethernauts.getMaxTokenIdInBatch(0)).toNumber(), batchSize - 1);
      assert.equal((await Ethernauts.getMaxTokenIdInBatch(1)).toNumber(), 2 * batchSize - 1);
      assert.equal((await Ethernauts.getMaxTokenIdInBatch(42)).toNumber(), 43 * batchSize - 1);
    });
  });

  describe('as the first tokens are minted', () => {
    let numMints = Math.floor(batchSize / 2);

    before('mint some tokens', async () => {
      await mintTokens(numMints);
    });

    it('shows that the token supply increased accordingly', async () => {
      assert.equal(await Ethernauts.totalSupply(), numMints);
    });

    it('shows the temporary URI for all minted tokens', async () => {
      for (let i = 0; i < numMints; i++) {
        await validateTempTokenUri(i);
      }
    });

    describe('when all the tokens in the batch are minted', () => {
      before('mint some tokens', async () => {
        await mintTokens(batchSize - numMints);
      });

      it('shows that the token supply increased accordingly', async () => {
        assert.equal(await Ethernauts.totalSupply(), batchSize);
      });

      it('shows that the random number is set', async () => {
        assert.notEqual(await Ethernauts.getRandomNumberForBatch(0), '0');
        assert.equal(await Ethernauts.getRandomNumberCount(), 1);
      });

      it('shows the definitive URI for all minted tokens', async () => {
        const randomNumber = await Ethernauts.getRandomNumberForBatch(0);

        for (let i = 0; i < batchSize; i++) {
          await validateTokenUri(i, randomNumber);
        }
      });

      it('shows the expected number of random numbers', async function () {
        assert.equal((await Ethernauts.getRandomNumberCount()).toNumber(), 1);
      });

      describe('when the owner manually generates the next random number', function () {
        before('manually generate random number', async function () {
          await Ethernauts.generateRandomNumber();
        });

        it('shows that the random number was generated', async function () {
          assert.equal((await Ethernauts.getRandomNumberCount()).toNumber(), 2);
        });
      });

      describe('when the tokens for the next batch are minted', () => {
        before('mint some tokens', async () => {
          await mintTokens(batchSize);
        });

        it('shows that the token supply increased accordingly', async () => {
          assert.equal(await Ethernauts.totalSupply(), 2 * batchSize);
          assert.equal(await Ethernauts.getRandomNumberCount(), '2');
        });

        it('shows that the random number is set', async () => {
          assert.notEqual((await Ethernauts.getRandomNumberForBatch(1)).toString(), '0');
        });

        it('shows the definitive URI for all minted tokens', async () => {
          const randomNumber = await Ethernauts.getRandomNumberForBatch(1);

          for (let i = batchSize; i < 2 * batchSize; i++) {
            await validateTokenUri(i, randomNumber);
          }
        });

        describe('when the tokens for the next batch are partially minted', function () {
          before('mint some tokens', async function () {
            await mintTokens(batchSize / 2);
          });

          it('shows the temporary URI for the newly minted tokens', async () => {
            for (let i = 2 * batchSize; i < 2.5 * batchSize; i++) {
              await validateTempTokenUri(i);
            }
          });

          describe('when the owner manually generates a random number', function () {
            before('manually generate random number', async function () {
              await Ethernauts.generateRandomNumber();
            });

            it('shows that the random number was generated', async function () {
              assert.equal((await Ethernauts.getRandomNumberCount()).toNumber(), 3);
            });

            it('shows the definitive URI for the newly minted tokens', async () => {
              const randomNumber = await Ethernauts.getRandomNumberForBatch(2);

              for (let i = 2 * batchSize; i < 2.5 * batchSize; i++) {
                await validateTokenUri(i, randomNumber);
              }
            });

            describe('when the batch is completed', function () {
              before('mint the rest of the tokens', async function () {
                await mintTokens(batchSize / 2);
              });

              it('shows that random number count did not increase', async function () {
                assert.equal((await Ethernauts.getRandomNumberCount()).toNumber(), 3);
              });

              it('shows the definitive URI for the newly minted tokens', async () => {
                const randomNumber = await Ethernauts.getRandomNumberForBatch(2);

                for (let i = 2 * batchSize; i < 3 * batchSize; i++) {
                  await validateTokenUri(i, randomNumber);
                }
              });

              describe('when the remaining batches are minted', () => {
                before('mint all tokens', async () => {
                  await mintTokens(maxTokens - 3 * batchSize);
                });

                it('shows that all assetIds are used and are unique', async () => {
                  const uris = [];

                  for (let i = 0; i < maxTokens; i++) {
                    const tokenURI = await Ethernauts.tokenURI(i);
                    uris.push(tokenURI);
                  }
                  assert.equal(uris.length, maxTokens);

                  const uriSet = new Set(uris);
                  assert.equal(uriSet.size, maxTokens);
                });
              });
            });
          });
        });
      });
    });
  });
});
