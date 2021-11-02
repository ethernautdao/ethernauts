const hre = require('hardhat');
const { getContractAt } = require('../src/utils/hardhat');
const onAnyKeypress = require('../src/utils/on-any-keypress');

async function main() {
  const Ethernauts = await getContractAt('Ethernauts');

  console.log(`Interacting with Ethernauts token at ${Ethernauts.address}`);
  console.log(`Tokens minted so far: ${(await Ethernauts.totalSupply()).toString()}`);

  Ethernauts.on('Transfer', async (from, to, amount, event) => {
    if (from === '0x0000000000000000000000000000000000000000') {
      const tokenId = event.args.tokenId.toString();

      const tx = await hre.ethers.provider.getTransaction(event.transactionHash);
      const value = hre.ethers.utils.formatEther(tx.value);

      console.log(`Mint of token #${tokenId} detected. User paid ${value} ETH`);
    }
  });

  console.log('Press any key to mint tokens (press q to exit)...');

  for await (const key of onAnyKeypress()) {
    if (key.ctrl && key.name === 'c') break;
    if (key.name === 'q') break;

    console.log('Minting a token...');

    const value = Math.random() * 13.4 + 0.2;

    const tx = await Ethernauts.mint({
      value: hre.ethers.utils.parseEther(`${value}`),
    });

    await tx.wait();

    console.log('Token minted!');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
