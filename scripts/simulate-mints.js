const fs = require('fs');
const readline = require('readline');
const hre = require('hardhat');
const { ethers } = hre;

async function main() {
  const deploymentPath = `./deployments/${hre.network.name}.json`;

  const data = _loadDeploymentFile(deploymentPath);

  if (!data.token || data.token === '') {
    throw new Error('No token data found');
  }

  const Ethernauts = await ethers.getContractAt('Ethernauts', data.token);
  console.log(`Interacting with Ethernauts token at ${Ethernauts.address}`);
  console.log(`Tokens minted so far: ${(await Ethernauts.totalSupply()).toString()}`);

  Ethernauts.on('Transfer', (from, to, amount, event) => {
    if (from === '0x0000000000000000000000000000000000000000') {
      const tokenId = event.args.tokenId.toString();

      console.log(`Mint detected, tokenId: ${tokenId}`);
    }
  });

  await _onAnyKeyPress(async () => {
    console.log('Minting a token...');

    const tx = await Ethernauts.mint({ value: ethers.utils.parseEther('0.2') });
    await tx.wait();

    console.log('Token minted!');
  });
}

async function _onAnyKeyPress(callback) {
  // Intentionally does not resolve to keep the process running.
  return new Promise(() => {
    console.log('Press any key to mint tokens (press q to exit)...');

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (chunk, key) => {
      if (key && key.name === 'q') {
        process.exit(0);
      }

      callback();
    });
  });
}

function _loadDeploymentFile(filepath) {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath));
  } else {
    throw new Error(`${filepath} not found`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
