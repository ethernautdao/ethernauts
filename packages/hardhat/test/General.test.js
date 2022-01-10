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
    describe('when deploying with too many giftable tokens', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.maxGiftable = 200;
        const max = 100;

        await assertRevert(
          factory.deploy(...Object.values(params)),
          `MaxGiftableError(${params.maxGiftable}, ${max})`
        );
      });
    });

    describe('when deploying with too many tokens', () => {
      it('reverts', async () => {
        const params = Object.assign({}, hre.config.defaults);
        params.maxTokens = 12000;
        const max = 10000;

        await assertRevert(
          factory.deploy(...Object.values(params)),
          `MaxTokensError(${params.maxTokens}, ${max})`
        );
      });
    });
  });

  describe('when deploying the contract with valid paratemeters', () => {
    before('deploy contract', async () => {
      Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
    });

    it('shows the correct coupon signer', async () => {
      assert.equal(await Ethernauts.couponSigner(), owner.address);
    });

    it('shold show the expected initial sale state', async () => {
      assert.equal(await Ethernauts.currentSaleState(), 0); // 0 = Paused
    });

    it('should have set the owner correctly', async () => {
      assert.equal(await Ethernauts.owner(), owner.address);
    });

    it('should have set the name and symbol correctly', async () => {
      assert.equal(await Ethernauts.name(), 'Ethernauts');
      assert.equal(await Ethernauts.symbol(), 'NAUTS');
    });

    it('shows the correct max supplies', async () => {
      assert.equal((await Ethernauts.maxGiftable()).toNumber(), hre.config.defaults.maxGiftable);
      assert.equal((await Ethernauts.maxTokens()).toNumber(), hre.config.defaults.maxTokens);
    });

    it('shows the correct mint price', async () => {
      assert.equal((await Ethernauts.mintPrice()).toString(), hre.config.defaults.mintPrice);
    });

    it('shows that the expected interfaces are supported', async () => {
      assert.ok(await Ethernauts.supportsInterface('0x01ffc9a7')); // ERC165
      assert.ok(await Ethernauts.supportsInterface('0x80ac58cd')); // ERC721
      assert.ok(await Ethernauts.supportsInterface('0x5b5e139f')); // ERC721Metadata
      assert.ok(await Ethernauts.supportsInterface('0x780e9d63')); // ERC721Enumarable
    });

    describe('when the owner calls protected functions', () => {
      it('allows the owner to change min and max price', async () => {
        let tx;

        tx = await Ethernauts.connect(owner).setMintPrice(0);
        await tx.wait();

        assert.equal(await Ethernauts.mintPrice(), '0');
      });
    });

    describe('when a regular user tries to call protected functions', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).withdraw(user.address),
          'caller is not the owner'
        );
        await assertRevert(
          Ethernauts.connect(user).setBaseURI('someURI'),
          'NotAuthorized("' + user.address + '")'
        );
        await assertRevert(
          Ethernauts.connect(user).setMintPrice(ethers.utils.parseEther('0.01')),
          'caller is not the owner'
        );
        await assertRevert(
          Ethernauts.connect(user).setEarlyMintPrice(ethers.utils.parseEther('0.01')),
          'caller is not the owner'
        );
        await assertRevert(Ethernauts.connect(user).gift(user.address), 'caller is not the owner');
        await assertRevert(Ethernauts.connect(user).setSaleState(2), 'caller is not the owner');
        await assertRevert(Ethernauts.connect(user).setPermanentURI(), 'caller is not the owner');
        await assertRevert(Ethernauts.connect(user).setUrlChanger(user.address), 'caller is not the owner');
      });
    });
    describe('when a url changer tries to call setBaseUri function', () => {
      it('succeedes', async () => {
        await Ethernauts.connect(owner).setUrlChanger(user.address);
        await assert.ok(Ethernauts.connect(user).setBaseURI('someURI'));
        assert.equal(await Ethernauts.urlChanger(), user.address);
      });
    });
  });
});
