const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Withdraw', () => {
  let Ethernauts;

  let owner, user, artist;

  const DAO_PERCENT = 0.95;
  const ARTIST_PERCENT = 0.05;
  const PERCENT_SCALAR = 1000000;

  before('identify signers', async () => {
    [owner, artist, user] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
  });

  before('open the sale', async () => {
    await (await Ethernauts.connect(owner).setSaleState(2)).wait();
  });

  describe('when some tokens have been minted', () => {
    async function mint(eth) {
      await (
        await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther(`${eth}`) })
      ).wait();
    }

    before('mints', async () => {
      await mint(1);
      await mint(2);
      await mint(10);
      await mint(0.5);
      await mint(0.2);
    });

    describe('when a regular user attempts to withdraw', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).withdraw(user.address, user.address),
          'caller is not the owner'
        );
      });
    });

    describe('when the owner withdraws all ETH', () => {
      let withdrawalReceipt;

      function percent(value, pct) {
        return value
          .mul(ethers.BigNumber.from(`${pct * PERCENT_SCALAR}`))
          .div(ethers.BigNumber.from('1000000'));
      }

      before('record ETH balances', async () => {
        Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
        owner.recordedEthBalance = await ethers.provider.getBalance(owner.address);
        artist.recordedEthBalance = await ethers.provider.getBalance(artist.address);
      });

      before('withdraw all contract ETH to the owner address', async () => {
        const tx = await Ethernauts.connect(owner).withdraw(owner.address, artist.address);
        withdrawalReceipt = await tx.wait();
      });

      it('increased the owners ETH balance', async () => {
        const paidInGas = ethers.BigNumber.from(withdrawalReceipt.cumulativeGasUsed).mul(
          withdrawalReceipt.effectiveGasPrice
        );

        assert.deepEqual(
          await ethers.provider.getBalance(owner.address),
          owner.recordedEthBalance
            .add(percent(Ethernauts.recordedEthBalance, DAO_PERCENT))
            .sub(paidInGas)
        );
      });

      it('increased the artist ETH balance', async () => {
        assert.deepEqual(
          await ethers.provider.getBalance(artist.address),
          artist.recordedEthBalance.add(percent(Ethernauts.recordedEthBalance, ARTIST_PERCENT))
        );
      });

      it('cleared the contracts ETH balance', async () => {
        assert.equal(await ethers.provider.getBalance(Ethernauts.address), '0');
      });
    });
  });
});
