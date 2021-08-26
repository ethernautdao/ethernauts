const assert = require('assert');
const { ethers } = require('hardhat');

describe('Ethernauts', () => {
  let Ethernauts;

  let owner, user;

  let ownerBalance, contractBalance;

  before('identify signers', async () => {
    ([owner, user] = await ethers.getSigners());
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy();
  });

  it('should have set the owner correctly', async () => {
    assert.equal(await Ethernauts.owner(), owner.address);
  });

  describe('when minting', () => {
    before('record balances', async () => {
      ownerBalance = await ethers.provider.getBalance(owner.address);
    });

    before('mint', async () => {
      const tx = await Ethernauts.mint({
        value: ethers.utils.parseEther('1'),
      });
      await tx.wait();
    });

    describe('when withdrawing', () => {
      let withdrawalReceipt;

      before('record balances', async () => {
        ownerBalance = await ethers.provider.getBalance(owner.address);
        contractBalance = await ethers.provider.getBalance(Ethernauts.address);
      });

      before('withdraw to owner', async () => {
        const tx = await Ethernauts.withdraw(owner.address);
        withdrawalReceipt = await tx.wait();
      });

      it('increased the owners balance', async () => {
        const newOwnerBalance = await ethers.provider.getBalance(owner.address);
        const payedInGas = ethers.BigNumber.from(withdrawalReceipt.gasUsed).mul(withdrawalReceipt.effectiveGasPrice);
        const expectedBalance = ownerBalance.add(contractBalance).sub(payedInGas);

        assert.equal(newOwnerBalance.toString(), expectedBalance.toString());
      });

      it('cleared the contracts balance', async () => {
        const newContractBalance = await ethers.provider.getBalance(Ethernauts.address);

        assert.equal(newContractBalance.toString(), '0');
      });
    });
  });
});
