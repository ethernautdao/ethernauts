const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Withdraw', () => {
  let Ethernauts;

  let owner, user;

  before('identify signers', async () => {
    [owner, artist, user] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
  });

  describe('when some tokens have been minted', () => {
    async function mint() {
      await (
        await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('0.2') })
      ).wait();
    }

    before('mints', async () => {
      await mint();
      await mint();
      await mint();
      await mint();
      await mint();
    });

    describe('when a regular user attempts to withdraw', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).withdraw(user.address),
          'caller is not the owner'
        );
      });
    });

    describe('when the owner withdraws all ETH', () => {
      let withdrawalReceipt;

      before('record ETH balances', async () => {
        Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
        owner.recordedEthBalance = await ethers.provider.getBalance(owner.address);
        artist.recordedEthBalance = await ethers.provider.getBalance(artist.address);
      });

      before('withdraw all contract ETH to the owner address', async () => {
        const tx = await Ethernauts.connect(owner).withdraw(owner.address);
        withdrawalReceipt = await tx.wait();
      });

      it('increased the owners ETH balance', async () => {
        const paidInGas = ethers.BigNumber.from(withdrawalReceipt.cumulativeGasUsed).mul(
          withdrawalReceipt.effectiveGasPrice
        );

        assert.deepEqual(
          await ethers.provider.getBalance(owner.address),
          owner.recordedEthBalance
            .add(Ethernauts.recordedEthBalance)
            .sub(paidInGas)
        );
      });

      it('cleared the contracts ETH balance', async () => {
        assert.equal(await ethers.provider.getBalance(Ethernauts.address), '0');
      });
    });
  });
});
