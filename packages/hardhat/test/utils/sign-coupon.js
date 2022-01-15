const { ethers } = require('hardhat');

async function signCouponForAddress(address, signer) {
  const payload = `0x000000000000000000000000${address.replace('0x', '')}`;
  const payloadHash = ethers.utils.keccak256(payload);
  const payloadHashBytes = ethers.utils.arrayify(payloadHash);
  return await signer.signMessage(payloadHashBytes);
}

module.exports = {
  signCouponForAddress,
};
