const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Random', () => {
  let Ethernauts;

  let owner;

  const maxTokens = 1000;
  const batchSize = 100;

  const baseURI = 'http://deadpine.io/';

  async function mintTokens(num) {
    let value = ethers.utils.parseEther('0.2');

    for (let i = 0; i < num; i++) {
      await (await Ethernauts.connect(owner).mint({ value })).wait();
    }
  }

  function calculateAssetId(tokenId, randomNumber) {
    const batchId = Math.floor(tokenId / batchSize);
    const offset = randomNumber.mod(ethers.BigNumber.from(batchSize)).toNumber();
    const maxTokenIdInBatch = batchSize * (batchId + 1) - 1;

    let assetId = tokenId + offset;
    if (assetId > maxTokenIdInBatch) {
        assetId -= batchSize;
    }

    return assetId;
  }

  async function validateTokenUri(tokenId, randomNumber) {
    const fromContract = await Ethernauts.tokenURI(tokenId);
    const expected = `${baseURI}${calculateAssetId(tokenId, randomNumber)}`

    assert.equal(fromContract, expected);
  }

  async function validateTempTokenUri(tokenId) {
    const fromContract = await Ethernauts.tokenURI(tokenId);
    const expected = `${baseURI}travelling_to_destination`;

    assert.equal(fromContract, expected);
  }

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

    describe('when the owner tries to generate a random number for the current batch, before all its tokens are minted', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(owner).setNextRandomNumber(),
          'Cannot set for unminted tokens'
        );
      });
    });

    describe('when all the tokens in the batch are minted', () => {
      before('mint some tokens', async () => {
        await mintTokens(batchSize - numMints);
      });

      it('shows that the token supply increased accordingly', async () => {
        assert.equal(await Ethernauts.totalSupply(), batchSize);
      });

      describe('when the random number for the current batch is set', () => {
        before('set random number for batch', async () => {
          await (await Ethernauts.connect(owner).setNextRandomNumber()).wait();
        });

        it('shows that the random number is set', async () => {
          assert.notEqual(
            await Ethernauts.getRandomNumberForBatch(0),
            '0'
          );
        });

        it('shows the definitive URI for all minted tokens', async () => {
          const randomNumber = await Ethernauts.getRandomNumberForBatch(0);

          for (let i = 0; i < batchSize; i++) {
            await validateTokenUri(i, randomNumber);
          }
        });

        describe('when the owner tries to set the random number for the next batch before its tokens are minted', () => {
          it('reverts', async () => {
            await assertRevert(
              Ethernauts.connect(owner).setNextRandomNumber(),
              'Cannot set for unminted tokens'
            );
          });
        });

        describe('when the tokens for the next batch are minted', () => {
          before('mint some tokens', async () => {
            await mintTokens(batchSize);
          });

          it('shows that the token supply increased accordingly', async () => {
            assert.equal(await Ethernauts.totalSupply(), 2 * batchSize);
          });

          describe('before the owner triggers the new random number', () => {
            it('shows the temporary URI for all minted tokens', async () => {
              for (let i = batchSize; i < 2 * batchSize; i++) {
                await validateTempTokenUri(i);
              }
            });
          });

          describe('when the owner creates the new random number', () => {
            before('set random number for batch', async () => {
              await (await Ethernauts.connect(owner).setNextRandomNumber()).wait();
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

            describe('when the remaining batches are minted', () => {
              before('mint all tokens', async () => {
                await mintTokens(maxTokens - 2 * batchSize);
              });

              before('set all random numbers', async () => {
                const numBatches = Math.floor(maxTokens / batchSize);
                const numRandomNumbers = (await Ethernauts.getRandomNumberCount()).toNumber();

                for (let i = 0; i < numBatches - numRandomNumbers; i++) {
                  await (await Ethernauts.connect(owner).setNextRandomNumber()).wait();
                }
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
