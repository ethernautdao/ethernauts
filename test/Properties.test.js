const assert = require('assert');
const { ethers } = require('hardhat');

describe('Properties', () => {
  let Ethernauts;

  let owner, user1, user2, user3;

  function encode(str) {
    return ethers.utils.formatBytes32String(str);
  }

  before('identify signers', async () => {
    [owner, user1, user2, user3] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
  });

  describe('when some tokens exist', () => {
    before('mint a few tokens', async () => {
      let tx;

      // One token for user 1
      await (await Ethernauts.connect(user1).mint({ value: ethers.utils.parseEther('0.2') })).wait();

      // Two tokens for user 2
      await (await Ethernauts.connect(user2).mint({ value: ethers.utils.parseEther('0.2') })).wait();
      await (await Ethernauts.connect(user2).mint({ value: ethers.utils.parseEther('0.2') })).wait();

      // One token for user 3
      await (await Ethernauts.connect(user3).mint({ value: ethers.utils.parseEther('0.2') })).wait();
    });

    describe('when the owner sets a property on user 1', () => {
      let propertySetReceipt;

      before('set the property', async () => {
        const tx = await Ethernauts.connect(owner).setPropertyOnToken(
          0,
          encode('mentor'),
          encode('true')
        );
        propertySetReceipt = await tx.wait();
      });

      it('emits a PropertySet event', async () => {
        const event = propertySetReceipt.events.find(e => e.event === 'PropertySet');

        assert.equal(event.args.tokenId, 0);
        assert.equal(event.args.propertyId, encode('mentor'));
        assert.equal(event.args.propertyValue, encode('true'));
      });

      it('properly sets the property', async () => {
        assert.equal(
          await Ethernauts.getPropertyOfToken(0, encode('mentor')),
          encode('true')
        );
      });

      describe('when the property is changed', () => {
        before('change the property', async () => {
          const tx = await Ethernauts.connect(owner).setPropertyOnToken(
            0,
            encode('mentor'),
            encode('false')
          );
          propertySetReceipt = await tx.wait();
        });

        it('properly sets the property', async () => {
          assert.equal(
            await Ethernauts.getPropertyOfToken(0, encode('mentor')),
            encode('false')
          );
        });
      });
    });
  });
});
