const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Ethernauts', () => {
  let factory, Ethernauts;

  let owner;

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('prepare factory', async () => {
    factory = await ethers.getContractFactory('Ethernauts');
  });

  describe('when deploying the contract with invalid parameters', () => {
    describe('when deploying with too many giftable tokens', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(200, 10000, 500000, 500000, ethers.utils.id('beef')),
          'Max giftable supply too large'
        );
      });
    });

    describe('when deploying with an invalid provenance hash', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(
            200,
            10000,
            500000,
            500000,
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ),
          'Max giftable supply too large'
        );
      });
    });

    describe('when deploying with too many tokens', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(100, 20000, 500000, 500000, ethers.utils.id('beef')),
          'Max token supply too large'
        );
      });
    });

    describe('when deploying with invalid distribution percentages', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(100, 10000, 700000, 500000, ethers.utils.id('beef')),
          'Invalid percentages'
        );
      });

      it('reverts', async () => {
        await assertRevert(
          factory.deploy(100, 10000, 1000, 50000, ethers.utils.id('beef')),
          'Invalid percentages'
        );
      });
    });
  });

  describe('when deploying the contract with valid paratemeters', () => {
    const maxGiftable = 100;
    const maxTokens = 10000;
    const daoPercent = 950000;
    const artistPercent = 50000;

    before('deploy contract', async () => {
      Ethernauts = await factory.deploy(
        maxGiftable,
        maxTokens,
        daoPercent,
        artistPercent,
        ethers.utils.id('beef')
      );
    });

    it('should have set the owner correctly', async () => {
      assert.equal(await Ethernauts.owner(), owner.address);
    });

    it('shows that no challenge is set', async () => {
      assert.equal(await Ethernauts.activeChallenge(), '0x0000000000000000000000000000000000000000');
    });

    it('should have set the name and symbol correctly', async () => {
      assert.equal(await Ethernauts.name(), 'Ethernauts');
      assert.equal(await Ethernauts.symbol(), 'ETHNTS');
    });

    it('shows the correct max supplies', async () => {
      assert.equal((await Ethernauts.maxGiftable()).toNumber(), maxGiftable);
      assert.equal((await Ethernauts.maxTokens()).toNumber(), maxTokens);
    });

    it('shows the correct percentages', async () => {
      assert.equal((await Ethernauts.daoPercent()).toNumber(), daoPercent);
      assert.equal((await Ethernauts.artistPercent()).toNumber(), artistPercent);
    });

    it('shows that the expexted interfaces are supported', async () => {
      assert.ok(await Ethernauts.supportsInterface('0x01ffc9a7')); // ERC165
      assert.ok(await Ethernauts.supportsInterface('0x80ac58cd')); // ERC721
      assert.ok(await Ethernauts.supportsInterface('0x5b5e139f')); // ERC721Metadata
      assert.ok(await Ethernauts.supportsInterface('0x780e9d63')); // ERC721Enumarable
    });

    describe('when a regular user tries to call protected functions', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).withdraw(user.address, user.address),
          'caller is not the owner'
        );
        await assertRevert(
          Ethernauts.connect(user).setBaseURI('someURI'),
          'caller is not the owner'
        );
        await assertRevert(
          Ethernauts.connect(user).gift(user.address),
          'caller is not the owner'
        );
      });
    });
  });
});
