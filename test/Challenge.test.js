const { ethers } = require('hardhat');
const assert = require('assert');
const assertRevert = require('./utils/assertRevert');

describe('Challenge', () => {
  let Ethernauts, Challenge;

  let users;
  let owner, user;

  before('identify signers', async () => {
    users = await ethers.getSigners();
    ([owner, user] = users);
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(100, 10000, 500000, 500000, ethers.utils.id('beef'));
  });

  describe('when a challenge is set', () => {
    before('deploy and set challenge', async () => {
      const factory = await ethers.getContractFactory('BasicChallenge');
      Challenge = await factory.deploy(10);

      const tx = await Ethernauts.connect(owner).setChallenge(Challenge.address);
      await tx.wait();
    });

    it('shows that the challenge is set', async () => {
      assert.equal(await Ethernauts.activeChallenge(), Challenge.address);
    });

    describe('when a user doesnt complete the challenge', () => {
      it('shows that the user should not get the discount', async () => {
        assert.deepEqual(await Challenge.discountFor(user.address), ethers.utils.parseEther('0'));
      });

      describe('when the user tries to buy at a discount', () => {
        it('reverts', async () => {
          await assertRevert(
            Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('0.05') }),
            'msg.value too low'
          );
        });
      });
    });

    describe('when a user completes the challenge', () => {
      before('complete challenge', async () => {
        const tx = await Challenge.connect(user).register();
        await tx.wait();
      });

      it('shows that the user should get the discount', async () => {
        assert.deepEqual(await Challenge.discountFor(user.address), ethers.utils.parseEther('0.15'));
      });

      describe('when the user tries to buy at a discount', () => {
        let receipt;
        let recordedTotalSupply;

        before('record values', async () => {
          recordedTotalSupply = await Ethernauts.totalSupply();
        });

        before('purchase', async () => {
          const tx = await Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('0.05') });
          receipt = await tx.wait();
        });

        it('shows that the total supply increased', async () => {
          assert.deepEqual(await Ethernauts.totalSupply(), recordedTotalSupply.add(ethers.BigNumber.from('1')));
        });

        it('shows that the user got the token', async () => {
          const event = receipt.events.find(e => e.event === 'Transfer');

          assert.equal(await Ethernauts.ownerOf(event.args.tokenId), user.address);
        });

        describe('when the user tries to buy at a discount again', () => {
          it('reverts', async () => {
            await assertRevert(
              Ethernauts.connect(user).mint({ value: ethers.utils.parseEther('0.05') }),
              'msg.value too low'
            );
          });
        });
      });
    });

    describe('when too many users complete the challenge', () => {
      let availableDiscounts;

      before('record available discounts', async () => {
        availableDiscounts = (await Challenge.discountsAvailable()).toNumber();
      });

      before('fill capacity', async () => {
        for (let i = 0; i <= availableDiscounts; i++) {
          const user = users[i + 2];

          const tx = await Challenge.connect(user).register();
          await tx.wait();
        }
      });

      describe('when another user tries to buy at a discount', () => {
        it('reverts', async () => {
          await assertRevert(
            Challenge.connect(owner).register(),
            'Capacity exceeded'
          );
        });
      });
    });
  });
});
