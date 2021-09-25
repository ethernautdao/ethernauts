const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Early mint', () => {
  let Ethernauts;

  let users;
  let owner, user;

  let mintedTokenId;
  let tokensMinted = 0;
  let tokenIds = [];

  let tx, receipt;

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = Object.assign({}, hre.config.defaults);
    Ethernauts = await factory.deploy(...Object.values(params));
  });

  describe('when the early sale is active', () => {
    before('set early', async () => {
      await (await Ethernauts.connect(owner).setSaleState(1)).wait();
    });

    describe('when attempting to mint when the early sale is not open', () => {
      before('set paused', async () => {
        if ((await Ethernauts.saleState()) !== 0) {
          await (await Ethernauts.connect(owner).setSaleState(0)).wait();
        }
      });

      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).mint({
            value: ethers.utils.parseEther('15'),
          }),
          'Not allowed in current state'
        );
      });
    });

    describe('when the owner opens the early sale', () => {
      before('open the early sale', async () => {
        await (await Ethernauts.connect(owner).setSaleState(1)).wait();
      });

      describe('when attempting to mint without enough ETH', () => {
        it('reverts', async () => {
          await assertRevert(
            Ethernauts.connect(user).mintEarly({
              value: ethers.utils.parseEther('0.01'),
            }),
            'bad msg.value'
          );
        });
      });

      // TODO
      describe.skip('when trying to mint early tokens with invalid coupons', () => {});

      describe('when minting many early tokens', () => {
        function itCorrectlyMintsEarlyTokensForUser(userNumber) {
          describe(`when minting an early token for user #${userNumber}`, () => {
            before('identify the user', async () => {
              user = users[userNumber];
            });

            before('keep track of values', async () => {
              if (!user.numTokens) user.numTokens = 0;
              if (!user.tokenIds) user.tokenIds = [];

              mintedTokenId = `${tokensMinted}`;
              tokenIds.push(mintedTokenId);
              user.tokenIds.push(mintedTokenId);

              user.numTokens++;
              tokensMinted++;
            });

            before('record ETH balances', async () => {
              Ethernauts.recordedEthBalance = await ethers.provider.getBalance(Ethernauts.address);
              user.recordedEthBalance = await ethers.provider.getBalance(user.address);
            });

            before('early mint', async () => {
              const signedCoupon = 'Bleh';

              tx = await Ethernauts.connect(user).mintEarly({
                value: hre.config.defaults.earlyMintPrice,
              });

              receipt = await tx.wait();
            });

            it('shows that the token now exists', async () => {
              assert.ok(await Ethernauts.exists(parseInt(mintedTokenId)));
            });

            it('shows that the next token does not exist', async () => {
              assert.ok(!(await Ethernauts.exists(parseInt(mintedTokenId) + 1)));
            });

            it('emitted a Transfer event', async () => {
              const event = receipt.events.find((e) => e.event === 'Transfer');

              assert.equal(event.args.from, '0x0000000000000000000000000000000000000000');
              assert.equal(event.args.to, user.address);
              assert.equal(event.args.tokenId.toString(), mintedTokenId);
            });

            it('reduced the user ETH balance', async () => {
              const paidInGas = ethers.BigNumber.from(receipt.cumulativeGasUsed).mul(
                receipt.effectiveGasPrice
              );

              assert.deepEqual(
                await ethers.provider.getBalance(user.address),
                user.recordedEthBalance.sub(tx.value).sub(paidInGas)
              );
            });

            it('incremented the contract ETH balance', async () => {
              assert.deepEqual(
                await ethers.provider.getBalance(Ethernauts.address),
                Ethernauts.recordedEthBalance.add(tx.value)
              );
            });

            it('incremented the user token balance', async () => {
              assert.equal(await Ethernauts.balanceOf(user.address), user.numTokens);
            });

            it('shows that the user owns the token', async () => {
              assert.equal(await Ethernauts.ownerOf(mintedTokenId), user.address);
            });

            it('can enumerate all the user tokens ids', async () => {
              for (let i = 0; i < user.tokenIds.length; i++) {
                const tokenId = user.tokenIds[i];

                assert.equal(await Ethernauts.tokenOfOwnerByIndex(user.address, i), tokenId);
              }
            });
          });
        }

        itCorrectlyMintsEarlyTokensForUser(1);
        itCorrectlyMintsEarlyTokensForUser(2);
        itCorrectlyMintsEarlyTokensForUser(3);
        itCorrectlyMintsEarlyTokensForUser(4);
        itCorrectlyMintsEarlyTokensForUser(5);
        itCorrectlyMintsEarlyTokensForUser(6);
        itCorrectlyMintsEarlyTokensForUser(7);

        // TODO
        describe.skip('when users try to reuse a coupon', () => {});

        // TODO
        describe.skip('when to use a coupon signed for anothe user', () => {});

        describe('when the owner sets the sale state to open', () => {
          before('open the sale', async () => {
            await (await Ethernauts.connect(owner).setSaleState(2)).wait();
          });

          itCorrectlyMintsEarlyTokensForUser(1);
          itCorrectlyMintsEarlyTokensForUser(5);
          itCorrectlyMintsEarlyTokensForUser(2);
          itCorrectlyMintsEarlyTokensForUser(6);
          itCorrectlyMintsEarlyTokensForUser(1);
          itCorrectlyMintsEarlyTokensForUser(2);
          itCorrectlyMintsEarlyTokensForUser(5);
          itCorrectlyMintsEarlyTokensForUser(3);

          describe('when checking on all minted NFTs', () => {
            it('can enumerate all token ids', async () => {
              for (let i = 0; i < tokenIds.length; i++) {
                const tokenId = tokenIds[i];

                assert.equal(await Ethernauts.tokenByIndex(i), tokenId);
              }
            });
          });
        });
      });
    });
  });
});