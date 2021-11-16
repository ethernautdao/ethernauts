const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const List = require('prompt-list');
const { getContractAt } = require('../src/utils/hardhat');
const { task } = require('hardhat/config');

const SALE_STATES = ['Paused', 'Early', 'Open'];

task('sale-state', 'Changes the sale state of the Ethernauts NFT contract')
  .setAction(async (taskArguments, hre) => {
    const Ethernauts = await getContractAt('Ethernauts');

    const saleStateIdxToName = (idx) => SALE_STATES[idx];
    const saleStateNameToIdx = (name) => SALE_STATES.indexOf(name);

    console.log(`Current sale state ${saleStateIdxToName(
      await Ethernauts.currentSaleState()
    )}`);

    const list = new List({
      name: 'Sale state',
      message: 'Change sale state?',
      choices: SALE_STATES
    });

    const answer = await list.run();
    console.log(answer);

    const tx = await Ethernauts.setSaleState(saleStateNameToIdx(answer));
    const receipt = await tx.wait();
    console.log(receipt);
  });
