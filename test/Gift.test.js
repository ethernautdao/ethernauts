const { ethers } = require('hardhat');
const assert = require('assert');
const assertRevert = require('./utils/assertRevert');

describe('Gift', () => {
  let Ethernauts;

  let users;
  let owner, user;

  let mintedTokenId;
  let tokensMinted = 0;
  let tokensGifted = 0;

  before('identify signers', async () => {
    users = await ethers.getSigners();
    ([owner, user] = users);
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(100, 10000, 500000, 500000);
  });

  describe('when a regular user tries to gift an NFT', () => {
    it('reverts', async () => {
      await assertRevert(
        Ethernauts.connect(user).gift(user.address),
        'caller is not the owner'
      );
    });
  });

  describe('when the owner gifts NFTs', () => {
    function itCorrectlyGiftsTokensForUser(userNumber) {
      describe(`when gifting a token for user #${userNumber}`, () => {

        before('identify the user', async () => {
          user = users[userNumber];
        });

        before('keep track of values', async () => {
          if (!user.numTokens) user.numTokens = 0;
          if (!user.tokenIds) user.tokenIds = [];

          mintedTokenId = `${tokensMinted}`;
          user.tokenIds.push(mintedTokenId);

          user.numTokens++;
          tokensMinted++;
          tokensGifted++;
        });

        before('gift', async () => {
          tx = await Ethernauts.connect(owner).gift(user.address);

          receipt = await tx.wait();
        });

        it('incremented the user token balance', async () => {
          assert.equal(
            await Ethernauts.balanceOf(user.address),
            user.numTokens
          );
        });

        it('shows that the user owns the token', async () => {
          assert.equal(
            await Ethernauts.ownerOf(mintedTokenId),
            user.address
          );
        });

        it('shows that the amount of gifted tokens increased', async () => {
          assert.equal(
            await Ethernauts.tokensGifted(),
            tokensGifted
          );
        });
      });
    }

    itCorrectlyGiftsTokensForUser(1);
    itCorrectlyGiftsTokensForUser(1);
    itCorrectlyGiftsTokensForUser(2);
    itCorrectlyGiftsTokensForUser(2);
    itCorrectlyGiftsTokensForUser(2);
    itCorrectlyGiftsTokensForUser(1);
    itCorrectlyGiftsTokensForUser(3);
    itCorrectlyGiftsTokensForUser(4);
    itCorrectlyGiftsTokensForUser(1);
    itCorrectlyGiftsTokensForUser(5);
    itCorrectlyGiftsTokensForUser(2);
    itCorrectlyGiftsTokensForUser(6);
    itCorrectlyGiftsTokensForUser(1);
    itCorrectlyGiftsTokensForUser(2);
    itCorrectlyGiftsTokensForUser(5);
    itCorrectlyGiftsTokensForUser(3);
  });

  describe('when trying to gift more than the maximum amount of giftable tokens', () => {
    before('mint max -1', async () => {
      const num = (await Ethernauts.maxGiftable()).toNumber() - (await Ethernauts.tokensGifted()).toNumber();

      let promises = [];
      for (let i = 0; i < num; i++) {
        promises.push((await Ethernauts.connect(owner).gift(owner.address)).wait());
      }

      await Promise.all(promises);
    });

    it('reverts', async () => {
      await assertRevert(
        Ethernauts.connect(owner).gift(owner.address),
        'No more Ethernauts can be gifted'
      );
    });
  });
});
