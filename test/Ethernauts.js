const assert = require('assert');
const { ethers } = require('hardhat');

describe('Ethernauts', () => {
  let Ethernauts;

  let owner, user1, user2, user3;

  let tx, receipt;

  before('identify signers', async () => {
    ([owner, user1, user2, user3] = await ethers.getSigners());
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy();
  });

  it('should have set the owner correctly', async () => {
    assert.equal(await Ethernauts.owner(), owner.address);
  });

  it('should have set the name and symbol correctly', async () => {
    assert.equal(await Ethernauts.name(), 'Ethernauts');
    assert.equal(await Ethernauts.symbol(), 'ETHNTS');
  });

  describe('when user1 mints a token', () => {
    before('record ETH balances', async () => {
      Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
      user1.recordedEthBalance = await ethers.provider.getBalance(user1.address);
    });

    before('mint the token', async () => {
      tx = await Ethernauts.connect(user1).mint({
        value: ethers.utils.parseEther('1'),
      });

      receipt = await tx.wait();
    });

    it('reduced the user ETH balance', async () => {
      const paidInGas = ethers.BigNumber.from(receipt.cumulativeGasUsed).mul(receipt.effectiveGasPrice);

      assert.deepEqual(
        await ethers.provider.getBalance(user1.address),
        user1.recordedEthBalance.sub(tx.value).sub(paidInGas)
      );
    });

    it('incremented the contract ETH balance', async () => {
      assert.deepEqual(
        await ethers.provider.getBalance(Ethernauts.address),
        Ethernauts.recordedEthBalance.add(tx.value)
      );
    });

    describe('when user2 mints a token', () => {
      before('record ETH balances', async () => {
        Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
        user2.recordedEthBalance = await ethers.provider.getBalance(user2.address);
      });

      before('mint the token', async () => {
        tx = await Ethernauts.connect(user2).mint({
          value: ethers.utils.parseEther('0.5'),
        });

        receipt = await tx.wait();
      });

      it('reduced the user ETH balance', async () => {
        const paidInGas = ethers.BigNumber.from(receipt.cumulativeGasUsed).mul(receipt.effectiveGasPrice);

        assert.deepEqual(
          await ethers.provider.getBalance(user2.address),
          user2.recordedEthBalance.sub(tx.value).sub(paidInGas)
        );
      });

      it('incremented the contract ETH balance', async () => {
        assert.deepEqual(
          await ethers.provider.getBalance(Ethernauts.address),
          Ethernauts.recordedEthBalance.add(tx.value)
        );
      });

      describe('when the owner withdraws all ETH', () => {
        before('record ETH balances', async () => {
          Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
          owner.recordedEthBalance = await ethers.provider.getBalance(owner.address);
        });

        before('withdraw all contract ETH to the owner address', async () => {
          tx = await Ethernauts.withdraw(owner.address);
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
});
