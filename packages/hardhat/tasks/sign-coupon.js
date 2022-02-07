const { task } = require('hardhat/config');
const { utils } = require('ethers');

const signCouponForAddress = async (address, signer) => {
  const payload = `0x000000000000000000000000${address.replace('0x', '')}`;
  const payloadHash = utils.keccak256(payload);
  const payloadHashBytes = utils.arrayify(payloadHash);

  const signedCoupon = await signer.signMessage(payloadHashBytes);

  return {
    [address]: signedCoupon,
  };
};

task('sign-coupon', 'Create a coupon for an address for being able to mint an early NFT')
  .addParam('address', 'The wallet you want to sign the coupon for')
  .setAction(async ({ address }, hre) => {
    const [couponSigner] = await hre.ethers.getSigners();
    const coupon = await signCouponForAddress(address, couponSigner);
    console.log(coupon);
    return coupon;
  });
