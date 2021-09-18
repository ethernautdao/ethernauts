const assert = require('assert');
const { ethers } = require('hardhat');

describe('Transfer', () => {
  let Ethernauts;

  let owner, user1, user2;

  before('identify signers', async () => {
    [owner, user1, user2] = await ethers.getSigners();
  });

  before('deploy contract', async () => {
    const factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));
  });

  before('open the sale', async () => {
    await (await Ethernauts.connect(owner).setSaleState(2)).wait();
  });

  describe('when a user mints a token', () => {
    before('mint', async () => {
      await (
        await Ethernauts.connect(user1).mint({
          value: ethers.utils.parseEther('0.2'),
        })
      ).wait();
    });

    it('shows that the user has the token', async () => {
      assert.equal(await Ethernauts.balanceOf(user1.address), '1');
      assert.equal(await Ethernauts.ownerOf('0'), user1.address);
    });

    describe('when the user transfers the token to another user', () => {
      before('transfer', async () => {
        await await Ethernauts.connect(user1).transferFrom(user1.address, user2.address, '0');
      });

      it('shows that the user no longer has the token', async () => {
        assert.equal(await Ethernauts.balanceOf(user1.address), '0');
      });

      it('shows that the new user has the token', async () => {
        assert.equal(await Ethernauts.balanceOf(user2.address), '1');
        assert.equal(await Ethernauts.ownerOf('0'), user2.address);
      });
    });
  });
});
