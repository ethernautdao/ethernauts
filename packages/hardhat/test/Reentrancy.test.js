const assertRevert = require('./utils/assertRevert');
const { ethers } = require('hardhat');
const { signCouponForAddress } = require('./utils/sign-coupon');

describe('Reentrancy', () => {
  let Ethernauts, Reentrant;

  let owner;

  let coupon;

  before('identify signers', async () => {
    [owner] = await ethers.getSigners();
  });

  before('deploy contracts', async () => {
    let factory;

    factory = await ethers.getContractFactory('Ethernauts');
    Ethernauts = await factory.deploy(...Object.values(hre.config.defaults));

    factory = await ethers.getContractFactory('Reentrant');
    Reentrant = await factory.deploy(Ethernauts.address);
  });

  describe('when attempting to perform a re-entrancy attack via the mint function', () => {
    before('open the sale', async () => {
      await (await Ethernauts.connect(owner).setSaleState(2)).wait();
    });

    it('reverts', async function () {
      await assertRevert(
        Reentrant.mint({
          value: ethers.utils.parseEther('0.2'),
        }),
        'reentrant call'
      );
    });
  });

  describe('when attempting to perform a re-entrancy attack via the early mint function', () => {
    before('open the early sale', async () => {
      await (await Ethernauts.connect(owner).setSaleState(1)).wait();
    });

    before('prepare dummy signature', async () => {
      coupon = await signCouponForAddress(Reentrant.address, owner);
    });

    it('reverts', async function () {
      await assertRevert(
        Reentrant.mintEarly(coupon, {
          value: ethers.utils.parseEther('0.2'),
        }),
        'reentrant call'
      );
    });
  });
});
