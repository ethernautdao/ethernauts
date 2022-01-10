const { task } = require('hardhat/config');
const { getContractAt } = require('../src/utils/hardhat');

task('exec', 'Exec a method on the Ethernauts contract')
  .addParam('method', 'The method that you want to call on the contract')
  .addOptionalParam('args', 'The arguments you want to pass, as an array in JSON format')
  .setAction(async ({ method, args }, hre) => {
    const Ethernauts = await getContractAt('Ethernauts');

    if (!Ethernauts.functions[method]) {
      throw new Error(`Method Ethernauts.${method} not found`);
    }

    const parsedArgs = args ? JSON.parse(args) : [];

    if (!Array.isArray(parsedArgs)) {
      throw new Error(`Invalid arguments given "${args}". Must be a JSON array, e.g [1, "0x00"]`);
    }

    console.log(`> Ethernauts.${method}(${JSON.stringify(parsedArgs).slice(1, -1)})`);

    const result = await Ethernauts[method](...parsedArgs);

    if (result.wait) {
      const receipt = await result.wait();
      console.log(receipt);
    } else {
      if (hre.ethers.BigNumber.isBigNumber(result)) {
        console.log(result.toString());
      } else {
        console.log(result);
      }
    }
  });
