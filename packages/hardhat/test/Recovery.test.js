const { ethers } = require('hardhat');
const assert = require('assert');
const assertRevert = require('./utils/assertRevert');

describe('Recovery', () => {
  let Ethernauts;
  let Token;

  let users;
  let owner, user;

  let tx;

  const totalSupply = 100;
  const stuck = 20;

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaultParameters));
  });

  before('deploy erc20', async () => {
    const factory = await ethers.getContractFactory('TokenMock');
    Token = await factory.deploy(totalSupply);
  });

  before('send tokens to Ethernauts contract', async () => {
    tx = await Token.connect(owner).transfer(Ethernauts.address, stuck);
    await tx.wait();
  });

  describe('when a regular user tries to access stuck funds', () => {
    it('reverts', async () => {
      const balance = await Token.balanceOf(Ethernauts.address);
      assert.notEqual(balance, 0);
      await assertRevert(
        Ethernauts.connect(user).recoverTokens(Token.address, owner.address, balance),
        'caller is not the owner'
      );
    });
  });

  describe('when the owner inputs the wrong destination address', () => {
    it('reverts', async () => {
      const balance = await Token.balanceOf(Ethernauts.address);
      assert.notEqual(balance, 0);
      await assertRevert(
        Ethernauts.connect(owner).recoverTokens(Token.address, Token.address, balance),
        'InvalidRecoveryAddress'
      );
    });
  });

  describe('when the owner tries to send too many tokens', () => {
    it('reverts', async () => {
      await assertRevert(
        Ethernauts.connect(owner).recoverTokens(Token.address, owner.address, totalSupply),
        'InsufficientERC20TokenBalance'
      );
    });
  });

  describe('when the owner recovers stuck funds', () => {
    it('allows the owner to retrieve stuck tokens from the contract', async () => {
      assert.equal(await Token.balanceOf(owner.address), totalSupply - stuck);
      assert.equal(await Token.balanceOf(Ethernauts.address), stuck);

      const balance = await Token.balanceOf(Ethernauts.address);
      tx = await Ethernauts.connect(owner).recoverTokens(Token.address, owner.address, balance);
      await tx.wait();

      assert.equal(await Token.balanceOf(owner.address), totalSupply);
      assert.equal(await Token.balanceOf(Ethernauts.address), 0);
    });
  });
});
