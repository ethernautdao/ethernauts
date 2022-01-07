const { deepEqual } = require('assert/strict');
const { ethers } = require('hardhat');
const parseMint = require('../../src/parse-mint');

describe('src/parse-mint.js', function () {
  let owner, Ethernauts;

  before('identify signers', async function () {
    [owner] = await ethers.getSigners();
  });

  before('deploy and prepare contract', async function () {
    const factory = await ethers.getContractFactory('contracts/Ethernauts.sol:Ethernauts');

    Ethernauts = await factory.deploy(
      ...Object.values({
        maxGiftable: 5,
        maxTokens: 100,
        batchSize: 10,
        mintPrice: ethers.utils.parseEther('0.2'),
        earlyMintPrice: ethers.utils.parseEther('0.015'),
        initialCouponSigner: owner.address,
      })
    );

    await Ethernauts.setSaleState(2);
  });

  it('correctly parses mint event', async function () {
    async function mint() {
      const value = Math.random() * 13.4 + 0.2;

      const tx = await Ethernauts.mint({
        value: hre.ethers.utils.parseEther(`${value}`),
      });

      await tx.wait();

      return await new Promise((resolve) => {
        Ethernauts.once('Transfer', async (...args) => {
          resolve(parseMint(...args));
        });
      });
    }

    deepEqual(await mint(), {
      to: owner.address,
      tokenId: 0,
    });

    deepEqual(await mint(), {
      to: owner.address,
      tokenId: 1,
    });
  });
});
