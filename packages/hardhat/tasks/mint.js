const { NumberPrompt } = require('enquirer');
const { getContractAt } = require('../src/utils/hardhat');
const { task } = require('hardhat/config');

task('mint', 'Mints Ethernauts tokens').setAction(async (taskArguments, hre) => {
  const Ethernauts = await getContractAt('Ethernauts');

  const prompt = new NumberPrompt({
    name: 'Number of tokens to mint',
    message: 'How many tokens would you like to mint?',
  });

  const answer = await prompt.run();
  console.log(answer);

  Ethernauts.on('Transfer', async (from, to, amount, event) => {
    if (from === '0x0000000000000000000000000000000000000000') {
      const tokenId = event.args.tokenId.toString();

      const tx = await hre.ethers.provider.getTransaction(event.transactionHash);
      const value = hre.ethers.utils.formatEther(tx.value);

      console.log(`Mint of token #${tokenId} detected. User paid ${value} ETH`);
    }
  });

  if (isNaN(answer)) {
    throw new Error(`Invalid amount ${answer}`);
  }

  for (let i = 0; i < answer; i++) {
    const value = Math.random() * 13.4 + 0.2;

    const tx = await Ethernauts.mint({
      value: hre.ethers.utils.parseEther(`${value}`),
    });

    await tx.wait();

    console.log('Token minted!');
  }
});
