
      // describe('when the owner withdraws all ETH', () => {
      //   before('record ETH balances', async () => {
      //     Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
      //     owner.recordedEthBalance = await ethers.provider.getBalance(owner.address);
      //   });

      //   before('withdraw all contract ETH to the owner address', async () => {
      //     tx = await Ethernauts.withdraw(owner.address);
      //     receipt = await tx.wait();
      //   });

      //   it('increased the owners ETH balance', async () => {
      //     const paidInGas = ethers.BigNumber.from(receipt.cumulativeGasUsed).mul(receipt.effectiveGasPrice);

      //     assert.deepEqual(
      //       await ethers.provider.getBalance(owner.address),
      //       owner.recordedEthBalance.add(Ethernauts.recordedEthBalance).sub(paidInGas)
      //     );
      //   });

      //   it('cleared the contracts ETH balance', async () => {
      //     assert.equal(await ethers.provider.getBalance(Ethernauts.address), '0');
      //   });
      // });
