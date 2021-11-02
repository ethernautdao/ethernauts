const { cleanEnv, makeValidator, str } = require('envalid');

// Custom config validator for positive Integer numbers
const int = makeValidator((x) => {
  if (/^[0-9]+$/.test(x)) return Number.parseInt(x);
  throw new Error('Expected a positive integer number');
});

require('dotenv').config();

module.exports = cleanEnv(process.env, {
  PINNING_SERVICE_NAME: str(),
  PINNING_SERVICE_KEY: str(),
  PINNING_SERVICE_ENDPOINT: str(),
  IPFS_GATEWAY_URL: str(),
  IPFS_API_URL: str(),
  MINTS_QUEUE_COCURRENCY: int({ default: 4 }),
});
