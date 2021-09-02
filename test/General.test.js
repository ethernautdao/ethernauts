const assert = require('assert');
const { ethers } = require('hardhat');

describe('Ethernauts', () => {
  let Ethernauts;

  let owner;

  before('identify signers', async () => {
    ([owner] = await ethers.getSigners());
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(10000);
  });

  it('should have set the owner correctly', async () => {
    assert.equal(await Ethernauts.owner(), owner.address);
  });

  it('should have set the name and symbol correctly', async () => {
    assert.equal(await Ethernauts.name(), 'Ethernauts');
    assert.equal(await Ethernauts.symbol(), 'ETHNTS');
  });
});
