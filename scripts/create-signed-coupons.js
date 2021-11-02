const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { utils } = require('ethers');
const { ethers } = require('hardhat');

const constants = require('../src/constants');

const accounts = require(`../resources/coupons/addresses.${process.env.HARDHAT_NETWORK}`);

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
  const [owner] = await ethers.getSigners();

  const signedCouponsPath = path.join(
    constants.COUPONS_FOLDER,
    `signed-coupons.${process.env.HARDHAT_NETWORK}.json`
  );

  const coupons = accounts.map((account) => signCouponForAddress(account, owner));

  const signedCoupons = await Promise.all(coupons);

  return fs.promises.writeFile(signedCouponsPath, JSON.stringify(signedCoupons, null, 2));
}

main()
  .then(() => console.log('Signed coupons has been created successfully'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
