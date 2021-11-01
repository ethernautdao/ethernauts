const { ethers } = require('hardhat');
const assert = require('assert');
const assertRevert = require('./utils/assertRevert');

describe('Stuck', () => {
  let Ethernauts;

  let users;
  let owner, user;

  let tx;


  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
  });

  before('deploy erc20', async () => {
    // TODO: deploy mock erc20
  });

  describe('when a regular user tries to access stuck funds', () => {
    // TODO: assert it fails
  });

  describe('when the owner recovers stuck funds', () => {
    // TODO: assert it fails
  });
});
