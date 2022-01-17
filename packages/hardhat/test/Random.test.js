const assert = require('assert');
const { ethers } = require('hardhat');

describe('Random', () => {
  let Ethernauts;

  let owner;

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
    const expected = `${baseURI}${calculateAssetId(tokenId, randomNumber)}`;

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

    const params = { ...hre.config.defaults };
    params.definitiveMaxGiftable = 0;
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

        describe('when the remaining batches are minted', () => {
          before('mint all tokens', async () => {
            await mintTokens(maxTokens - 2 * batchSize);
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
