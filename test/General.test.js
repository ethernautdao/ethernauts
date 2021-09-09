const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('General', () => {
  let factory, Ethernauts;

  let owner, user;

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('prepare factory', async () => {
    factory = await ethers.getContractFactory('Ethernauts');
  });

  describe('when deploying the contract with invalid parameters', () => {
    describe('when deploying with invalid price ranges', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.minPrice = 200;
        params.maxPrice = 100;

        await assertRevert(factory.deploy(...Object.values(params)), 'Invalid price range');
      });
    });

    describe('when deploying with too many giftable tokens', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.maxGiftable = 200;

        await assertRevert(
          factory.deploy(...Object.values(params)),
          'Max giftable supply too large'
        );
      });
    });

    describe('when deploying with an invalid provenance hash', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.provenance = '0x0000000000000000000000000000000000000000000000000000000000000000';

        await assertRevert(factory.deploy(...Object.values(params)), 'Invalid provenance hash');
      });
    });

    describe('when deploying with too many tokens', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.maxTokens = 12000;

        await assertRevert(factory.deploy(...Object.values(params)), 'Max token supply too large');
      });
    });

    describe('when deploying with invalid distribution percentages', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.daoPercent = 500000;
        params.artistPercent = 600000;

        await assertRevert(factory.deploy(...Object.values(params)), 'Invalid percentages');
      });

      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.daoPercent = 50000;
        params.artistPercent = 600000;

        await assertRevert(factory.deploy(...Object.values(params)), 'Invalid percentages');
      });
    });
  });

  describe('when deploying the contract with valid paratemeters', () => {
    before('deploy contract', async () => {
      Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
    });

    it('should have set the owner correctly', async () => {
      assert.equal(await Ethernauts.owner(), owner.address);
    });

    it('should have set the name and symbol correctly', async () => {
      assert.equal(await Ethernauts.name(), 'Ethernauts');
      assert.equal(await Ethernauts.symbol(), 'ETHNTS');
    });

    it('shows the correct max supplies', async () => {
      assert.equal((await Ethernauts.maxGiftable()).toNumber(), hre.config.defaults.maxGiftable);
      assert.equal((await Ethernauts.maxTokens()).toNumber(), hre.config.defaults.maxTokens);
    });

    it('shows the correct percentages', async () => {
      assert.equal((await Ethernauts.daoPercent()).toNumber(), hre.config.defaults.daoPercent);
      assert.equal(
        (await Ethernauts.artistPercent()).toNumber(),
        hre.config.defaults.artistPercent
      );
    });

    it('shows that the expexted interfaces are supported', async () => {
      assert.ok(await Ethernauts.supportsInterface('0x01ffc9a7')); // ERC165
      assert.ok(await Ethernauts.supportsInterface('0x80ac58cd')); // ERC721
      assert.ok(await Ethernauts.supportsInterface('0x5b5e139f')); // ERC721Metadata
      assert.ok(await Ethernauts.supportsInterface('0x780e9d63')); // ERC721Enumarable
    });

    describe('when the owner calls protected functions', () => {
      it('allows the owner to change min and max price', async () => {
        let tx;

        tx = await Ethernauts.connect(owner).setMinPrice(0);
        await tx.wait();

        tx = await Ethernauts.connect(owner).setMaxPrice(0);
        await tx.wait();

        assert.equal(await Ethernauts.minPrice(), '0');
        assert.equal(await Ethernauts.maxPrice(), '0');
      });
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
        await assertRevert(Ethernauts.connect(user).gift(user.address), 'caller is not the owner');
      });
    });
  });
});
