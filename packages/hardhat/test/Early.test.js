const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

const convertToWei = (payloadAmount) => ethers.utils.parseEther(payloadAmount.toString())

describe('Early mint', () => {
  let Ethernauts;
  
  let users;
  let owner, user, nextUser;
  
  let mintedTokenId;
  let tokensMinted = 0;
  let tokenIds = [];

  let tx, receipt;

  let coupon;

  async function signCouponForAddress(address, signer = owner) {
    const payload = `0x000000000000000000000000${address.replace('0x', '')}`;
    const payloadHash = ethers.utils.keccak256(payload);
    const payloadHashBytes = ethers.utils.arrayify(payloadHash);
    return await signer.signMessage(payloadHashBytes);
  }

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('prepare dummy signature', async () => {
    coupon = await owner.signMessage('Hello');
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = Object.assign({}, hre.config.defaults);
    Ethernauts = await factory.deploy(...Object.values(params));
  });

  describe('when attempting to mint when the early sale is not open', () => {
    before('set paused', async () => {
      if ((await Ethernauts.currentSaleState()) !== 0) {
        await (await Ethernauts.connect(owner).setSaleState(0)).wait();
      }
    });

    it('reverts', async () => {
      await assertRevert(
        Ethernauts.connect(user).mintEarly(coupon, {
          value: ethers.utils.parseEther('15'),
        }),
        `StateMismatchError(0, 1)`
      );
    });
  });

  describe('when the early sale is active', () => {
    before('open the early sale', async () => {
      await (await Ethernauts.connect(owner).setSaleState(1)).wait();
    });

    describe('when attempting to mint without enough ETH', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).mintEarly(coupon, {
            value: ethers.utils.parseEther('0.01'),
          }),
          `EarlyMintPriceError(${convertToWei('0.01')}, ${convertToWei('0.015')})`
        );
      });
    });

    describe('when trying to mint early tokens with invalid coupons', () => {
      before('create an invalid coupon', async () => {
        coupon = await signCouponForAddress(user.address, user);
      });

      it('shows that the coupon is invalid', async () => {
        assert.equal(await Ethernauts.isCouponSignedForUser(user.address, coupon), false);
      });

      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).mintEarly(coupon, {
            value: hre.config.defaults.earlyMintPrice,
          }),
          `InvalidUserCouponError(false)`
        );
      });
    });

    describe('when minting many early tokens', () => {
      function itCorrectlyMintsEarlyTokensForUser(userNumber) {
        describe(`when minting an early token for user #${userNumber}`, () => {
          let coupon;

          before('identify the user', async () => {
            user = users[userNumber];
            nextUser = users[userNumber + 1];
          });

          before('sign coupon', async () => {
            coupon = await signCouponForAddress(user.address);
          });

          it('shows that the coupon is valid', async () => {
            assert.equal(await Ethernauts.isCouponSignedForUser(user.address, coupon), true);
          });

          it('shows that the coupon is not valid for another user', async () => {
            assert.equal(await Ethernauts.isCouponSignedForUser(nextUser.address, coupon), false);
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
            tx = await Ethernauts.connect(user).mintEarly(coupon, {
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

      describe('when users try to reuse a coupon', () => {
        let someUser;

        before('identify user', async () => {
          someUser = users[1];
        });

        it('shows that the coupon has been used', async () => {
          assert.equal(await Ethernauts.userRedeemedCoupon(someUser.address), true);
        });

        it('reverts', async () => {
          await assertRevert(
            Ethernauts.connect(someUser).mintEarly(await signCouponForAddress(someUser.address), {
              value: hre.config.defaults.earlyMintPrice,
            }),'RedeemedCouponError(true)'
          );
        });
      });

      describe('when a user tries to use a coupon signed for another user', () => {
        it('reverts', async () => {
          const someUser = users[8];

          await assertRevert(
            Ethernauts.connect(someUser).mintEarly(await signCouponForAddress(user.address), {
              value: hre.config.defaults.earlyMintPrice,
            }), 'InvalidUserCouponError(false)'
          );
        });
      });

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
