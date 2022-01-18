const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('State Changes', () => {
  let Ethernauts;

  let users;
  let owner;

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = { ...hre.config.defaults };
    params.definitiveMaxGiftable = 10;
    params.definitiveMaxTokens = 100;

    Ethernauts = await factory.deploy(...Object.values(params));
  });

  it('contract starts in state paused', async () => {
    assert.equal(await Ethernauts.currentSaleState(), 0);
  });

  it('owner can freely change from one state to another (not complete)', async () => {
    await (await Ethernauts.connect(owner).setSaleState(1)).wait();
    assert.equal(await Ethernauts.currentSaleState(), 1);

    await (await Ethernauts.connect(owner).setSaleState(2)).wait();
    assert.equal(await Ethernauts.currentSaleState(), 2);

    await (await Ethernauts.connect(owner).setSaleState(1)).wait();
    assert.equal(await Ethernauts.currentSaleState(), 1);

    await (await Ethernauts.connect(owner).setSaleState(0)).wait();
    assert.equal(await Ethernauts.currentSaleState(), 0);
  });

  it('state cannot be overriden with the same value', async () => {
    await assertRevert(Ethernauts.connect(owner).setSaleState(0), 'NoChange');
    assert.equal(await Ethernauts.currentSaleState(), 0);
  });
});
