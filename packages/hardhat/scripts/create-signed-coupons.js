const fs = require('fs');
const path = require('path');
const { utils } = require('ethers');
const { ethers } = require('hardhat');

const constants = require('../src/constants');

const awardedAccounts = require(`../src/data/awarded-accounts.${process.env.HARDHAT_NETWORK}`);

const signCouponForAddress = async (address, signer) => {
  const payload = `0x000000000000000000000000${address.replace('0x', '')}`;
  const payloadHash = utils.keccak256(payload);
  const payloadHashBytes = utils.arrayify(payloadHash);

  const signedCoupon = await signer.signMessage(payloadHashBytes);

  return {
    [address]: signedCoupon,
  };
};

async function main() {
  const [couponSigner] = await ethers.getSigners();

  const signedCouponsPath = path.join(
    constants.DATA_DAPP_FOLDER,
    `signed-coupons.${process.env.HARDHAT_NETWORK}.json`
  );

  const coupons = awardedAccounts.map((account) => signCouponForAddress(account, couponSigner));

  const signedCoupons = await Promise.all(coupons);

  return fs.promises.writeFile(signedCouponsPath, JSON.stringify(signedCoupons, null, 2));
}

main()
  .then(() => console.log('Signed coupons has been created successfully'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
