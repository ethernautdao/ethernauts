const assert = require('assert');
const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');

describe('Mint', () => {
  let Ethernauts;

  let users;
  let owner, user;

  let tx, receipt;

  let mintedTokenId;
  let tokensMinted = 0;
  let tokenIds = [];

  const baseURI = 'http://deadpine.io/';

  before('identify signers', async () => {
    users = await ethers.getSigners();
    [owner, user] = users;
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');

    const params = Object.assign({}, hre.config.defaults);
    params.maxTokens = 100;
    params.maxGiftable = 10;

    Ethernauts = await factory.deploy(...Object.values(params));
  });

  before('set base URI', async () => {
    const tx = await Ethernauts.connect(owner).setBaseURI(baseURI);
    await tx.wait();
  });

  describe('when attempting to mint when the sale is not open', () => {
    before('set paused', async () => {
      if ((await Ethernauts.currentSaleState()) !== 0) {
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

  describe('when the owner opens the sale', () => {
    before('open the sale', async () => {
      await (await Ethernauts.connect(owner).setSaleState(2)).wait();
    });

    describe('when attempting to mint without enough ETH', () => {
      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).mint({
            value: ethers.utils.parseEther('0.01'),
          }),
          'Invalid msg.value'
        );
      });
    });

    describe('when minting many tokens', () => {
      function itCorrectlyMintsTokensForUser(userNumber) {
        describe(`when minting a token for user #${userNumber}`, () => {
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

          before('mint', async () => {
            tx = await Ethernauts.connect(user).mint({
              value: ethers.utils.parseEther('0.2'),
            });

            receipt = await tx.wait();
          });

          it('shows that the temporary base URI is set', async () => {
            assert.equal(
              await Ethernauts.tokenURI(mintedTokenId),
              `${baseURI}travelling_to_destination`
            );
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

      itCorrectlyMintsTokensForUser(1);
      itCorrectlyMintsTokensForUser(1);
      itCorrectlyMintsTokensForUser(2);
      itCorrectlyMintsTokensForUser(2);
      itCorrectlyMintsTokensForUser(2);
      itCorrectlyMintsTokensForUser(1);
      itCorrectlyMintsTokensForUser(3);
      itCorrectlyMintsTokensForUser(4);
      itCorrectlyMintsTokensForUser(1);
      itCorrectlyMintsTokensForUser(5);
      itCorrectlyMintsTokensForUser(2);
      itCorrectlyMintsTokensForUser(6);
      itCorrectlyMintsTokensForUser(1);
      itCorrectlyMintsTokensForUser(2);
      itCorrectlyMintsTokensForUser(5);
      itCorrectlyMintsTokensForUser(3);

      describe('when checking on all minted NFTs', () => {
        it('can enumerate all token ids', async () => {
          for (let i = 0; i < tokenIds.length; i++) {
            const tokenId = tokenIds[i];

            assert.equal(await Ethernauts.tokenByIndex(i), tokenId);
          }
        });
      });
    });

    describe('when trying to mint more than the maximum amount of Ethernauts', () => {
      before('mint max -1', async () => {
        const num =
          (await Ethernauts.maxTokens()).toNumber() -
          (await Ethernauts.maxGiftable()).toNumber() -
          (await Ethernauts.totalSupply()).toNumber();

        let promises = [];
        for (let i = 0; i < num; i++) {
          promises.push(
            (
              await Ethernauts.connect(user).mint({
                value: ethers.utils.parseEther('0.2'),
              })
            ).wait()
          );
        }

        await Promise.all(promises);
      });

      it('public sale status is now completed', async () => {
        assert.equal(await Ethernauts.currentSaleState(), 3);
      });

      it('reverts', async () => {
        await assertRevert(
          Ethernauts.connect(user).mint({
            value: ethers.utils.parseEther('0.2'),
          }),
          'Not allowed in current state'
        );
      });
    });

    describe('when trying to mint giftable after public sale has ended', () => {
      before('mint all public nft available', async () => {
        const num =
          (await Ethernauts.maxTokens()).toNumber() -
          (await Ethernauts.maxGiftable()).toNumber() -
          (await Ethernauts.totalSupply()).toNumber();

        let promises = [];
        for (let i = 0; i < num; i++) {
          promises.push(
            (
              await Ethernauts.connect(user).mint({
                value: ethers.utils.parseEther('0.2'),
              })
            ).wait()
          );
        }

        await Promise.all(promises);

        assert.equal(await Ethernauts.currentSaleState(), 3);
      });

      it('mint all giftable', async () => {
        const giftables = (await Ethernauts.maxGiftable()).toNumber();

        for (let i = 0; i < giftables; i++) {
          (await Ethernauts.connect(owner).gift(user.address)).wait();
        }

        assert.equal(await Ethernauts.tokensGifted(), giftables);
        assert.equal(await Ethernauts.availableToMint(), 0);
        assert.equal(await Ethernauts.currentSaleState(), 3);
      });
    });
  });
});
