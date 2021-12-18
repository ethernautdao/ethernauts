module.exports = function parseMint(from, to, tokenId) {
  if (from !== '0x0000000000000000000000000000000000000000') return;
  tokenId = Number(tokenId);
  return { to, tokenId };
};
