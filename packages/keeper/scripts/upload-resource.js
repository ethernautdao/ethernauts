const processMint = require('../src/process-mint');

async function main() {
  const tokenId = process.argv[2];

  if (!/^[0-9]+$/.test(tokenId)) {
    throw new Error(`Invalid tokenId "${tokenId}"`);
  }

  await processMint({
    tokenId,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
