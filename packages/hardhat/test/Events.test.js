const assert = require('assert');
const { ethers } = require('hardhat');

describe('Test events emitted', () => {
  let Ethernauts;

  let users;
  let owner, user;

  let tx, receipt;

  const baseURI = 'http://deadpine.io/';

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = Object.assign({}, hre.config.defaults);
    params.maxTokens = 100;
    params.maxGiftable = 10;

    Ethernauts = await factory.deploy(...Object.values(params));
  });

  before('set base URI', async () => {
    const tx = await Ethernauts.connect(owner).setBaseURI(baseURI);
    await tx.wait();
  });

  describe('When sale state changes', () => {
    it('shows SaleStateChanged event is emitted with state Early', async () => {
      receipt = await (await Ethernauts.connect(owner).setSaleState(1)).wait();
      const event = receipt.events.find((e) => e.event === 'SaleStateChanged');
      assert.equal(event.args.state, 1);
    });

    it('shows SaleStateChanged event is emitted with state Open', async () => {
      receipt = await (await Ethernauts.connect(owner).setSaleState(2)).wait();
      const event = receipt.events.find((e) => e.event === 'SaleStateChanged');
      assert.equal(event.args.state, 2);
    });
  });

  describe('When mint price changes', () => {
    it('shows MintPriceChanged event is emitted', async () => {
      const newPrice = ethers.utils.parseEther('0.01');
      tx = await Ethernauts.connect(owner).setMintPrice(newPrice);
      receipt = await tx.wait();
      const event = receipt.events.find((e) => e.event === 'MintPriceChanged');
      assert.equal(event.args.mintPrice.toString(), newPrice.toString());
    });
  });

  describe('When early mint price changes', () => {
    it('shows EarlyMintPriceChanged event is emitted', async () => {
      const newPrice = ethers.utils.parseEther('0.01');
      tx = await Ethernauts.connect(owner).setEarlyMintPrice(newPrice);
      receipt = await tx.wait();
      const event = receipt.events.find((e) => e.event === 'EarlyMintPriceChanged');
      assert.equal(event.args.earlyMintPrice.toString(), newPrice.toString());
    });
  });

  describe('When coupon signer changes', () => {
    it('shows CouponSignerChanged event is emitted', async () => {
      receipt = await (await Ethernauts.connect(owner).setCouponSigner(user.address)).wait();
      const event = receipt.events.find((e) => e.event === 'CouponSignerChanged');
      assert.equal(event.args.couponSigner, user.address);
    });
  });

  describe('When base URI changes', () => {
    it('shows BaseTokenURIChanged event is emitted', async () => {
      receipt = await (await Ethernauts.connect(owner).setBaseURI('http://pinedead.io/')).wait();
      const event = receipt.events.find((e) => e.event === 'BaseTokenURIChanged');
      assert.equal(event.args.baseTokenURI, 'http://pinedead.io/');
    });
  });

  describe('When Withdraw is triggered', () => {
    it('shows WithdrawTriggered event is emitted', async () => {
      receipt = await (await Ethernauts.connect(owner).withdraw(user.address)).wait();
      const event = receipt.events.find((e) => e.event === 'WithdrawTriggered');
      assert.equal(event.args.beneficiary, user.address);
    });
  });

  describe('When PermanentURL is locked', () => {
    it('shows PermanentURITriggered event is emitted', async () => {
      receipt = await (await Ethernauts.connect(owner).setPermanentURI()).wait();
      const event = receipt.events.find((e) => e.event === 'PermanentURITriggered');
      assert.equal(event.args.value, true);
    });
  });
});
