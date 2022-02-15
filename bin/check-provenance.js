/**
 * Helper script for checking the contents of the provenance hash. It will parse
 * the file located at the root folder called provenanceHash-concatenated.txt
 *
 * > NOTICE: This file does not use any npm dependendencies for security and audit
 *   purposes. This way, anyone who executes it can easily verify what is going to do.
 *
 * When executing this script, it will show on the terminal the list of IPFS hashes
 * for all the assets, in the correct order that they were used to generate the
 * provenanceHash for the Ethernauts.sol contract deployment:
 *   https://optimistic.etherscan.io/address/0xA433e0Bf662Dd934833C66D4f03711e1CCE9c9B2#code
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* CONSTANTS */
const FILEPATH = path.resolve(__dirname, '..', 'provenanceHash-concatenated.txt');
const ASSET_COUNT = 10000;
const HASH_LENGTH = 46;
const ASSET_ID = Number(process.argv[2]);

/* SCRIPT START */
const concatenated = fs.readFileSync(FILEPATH).toString().trim();

if (concatenated.length !== HASH_LENGTH * ASSET_COUNT) {
  throw new Error(`Invalid contents on ${FILEPATH}`);
}

console.log();

for (let i = 0; i < ASSET_COUNT; i++) {
  const hash = concatenated.slice(i * HASH_LENGTH, i * HASH_LENGTH + HASH_LENGTH);

  if (Number.isNaN(ASSET_ID) || i === ASSET_ID) {
    console.log(`${i.toString().padStart(ASSET_COUNT.toString().length - 1, '0')}: ${hash}`);
  }
}

/* SHOW PROVENANCE HASH */
const provenanceHash = crypto.createHash('md5').update(concatenated).digest('hex');

console.log();
console.log('=== Provenance MD5 Hash ===');
console.log(provenanceHash);
console.log('---------------------------');
