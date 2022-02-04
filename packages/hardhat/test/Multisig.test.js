const assert = require('assert');
const { ethers } = require('hardhat');
const { signCouponForAddress } = require('./utils/sign-coupon');

describe('Multisig', () => {
  let Ethernauts, Multisig;

  let owner, user;

  before('identify signers', async () => {
    [owner, user] = await ethers.getSigners();
  });

  before('deploy contracts', async () => {
    let factory;

    factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaultParameters));

    factory = await ethers.getContractFactory('Multisig');
    Multisig = await factory.deploy(Ethernauts.address);
  });

  describe('when a contract mints a token', () => {
    describe('on the early sale', function () {
      before('open the sale', async () => {
        await (await Ethernauts.setSaleState(1)).wait();
      });

      before('mint', async () => {
        const coupon = await signCouponForAddress(Multisig.address, owner);

        await (
          await Multisig.mintEarly(coupon, {
            value: ethers.utils.parseEther('0.1'),
          })
        ).wait();
      });

      it('shows that the contract has the token', async () => {
        assert.equal(await Ethernauts.balanceOf(Multisig.address), '1');
        assert.equal(await Ethernauts.ownerOf('0'), Multisig.address);
      });

      describe('when the contract transfers the token to another user', () => {
        before('transfer', async () => {
          await await Multisig.transfer(user.address, '0');
        });

        it('shows that the contract no longer has the token', async () => {
          assert.equal(await Ethernauts.balanceOf(Multisig.address), '0');
        });

        it('shows that the user has the token', async () => {
          assert.equal(await Ethernauts.balanceOf(user.address), '1');
          assert.equal(await Ethernauts.ownerOf('0'), user.address);
        });
      });
    });

    describe('on the public sale', function () {
      before('open the sale', async () => {
        await (await Ethernauts.setSaleState(2)).wait();
      });

      before('mint', async () => {
        await (
          await Multisig.connect(user).mint({
            value: ethers.utils.parseEther('0.2'),
          })
        ).wait();
      });

      it('shows that the contract has the token', async () => {
        assert.equal(await Ethernauts.balanceOf(Multisig.address), '1');
        assert.equal(await Ethernauts.ownerOf('1'), Multisig.address);
      });

      describe('when the contract transfers the token to another user', () => {
        before('transfer', async () => {
          await await Multisig.transfer(user.address, '1');
        });

        it('shows that the contract no longer has the token', async () => {
          assert.equal(await Ethernauts.balanceOf(Multisig.address), '0');
        });

        it('shows that the user has the token', async () => {
          assert.equal(await Ethernauts.balanceOf(user.address), '2');
          assert.equal(await Ethernauts.ownerOf('1'), user.address);
        });
      });
    });
  });
});
