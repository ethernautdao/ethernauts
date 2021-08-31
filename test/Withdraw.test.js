const assert = require('assert');
const { ethers } = require('hardhat');

describe('Withdraw', () => {
  let Ethernauts;

  let owner, user;

  before('identify signers', async () => {
    ([owner, user] = await ethers.getSigners());
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy();
  });

  describe('when some tokens have been minted', () => {
    before('mints', async () => {
      await (await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('1') })).wait();
      await (await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('2') })).wait();
      await (await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('0.5') })).wait();
      await (await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('0.1') })).wait();
    });

    describe('when the owner withdraws all ETH', () => {
      let withdrawalReceipt;

      before('record ETH balances', async () => {
        Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
        owner.recordedEthBalance = await ethers.provider.getBalance(owner.address);
      });

      before('withdraw all contract ETH to the owner address', async () => {
        const tx = await Ethernauts.withdraw(owner.address);
        receipt = await tx.wait();
      });

      it('increased the owners ETH balance', async () => {
        const paidInGas = ethers.BigNumber.from(receipt.cumulativeGasUsed).mul(receipt.effectiveGasPrice);

        assert.deepEqual(
          await ethers.provider.getBalance(owner.address),
          owner.recordedEthBalance.add(Ethernauts.recordedEthBalance).sub(paidInGas)
        );
      });

      it('cleared the contracts ETH balance', async () => {
        assert.equal(await ethers.provider.getBalance(Ethernauts.address), '0');
      });
    });
  });
});
