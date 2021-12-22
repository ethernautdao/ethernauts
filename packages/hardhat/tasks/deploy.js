const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { task } = require('hardhat/config');
require('dotenv').config({ path: './.env' });

const DEPLOYMENT_SCHEMA = {
  token: '',
};

task('deploy', 'Deploys the Ethernauts NFT contract').setAction(async (taskArguments, hre) => {
  console.log(`Deploying Ethernauts in network: ${hre.network.name}`);

  const deploymentPath = `./deployments/${hre.network.name}.json`;

  const data = _loadOrCreateDeploymentFile(deploymentPath);

  if (hre.network.name !== 'local' && data.token !== '') {
    throw new Error(`Token already exists at ${data.token}`);
  }

  await _confirmParameters();

  const Ethernauts = await _deployContract();
  console.log(`Ethernauts token deployed at ${Ethernauts.address}`);

  data.token = Ethernauts.address;
  await _verify(Ethernauts.address);
  await fsp.mkdir(path.dirname(deploymentPath), { recursive: true });
  await fsp.writeFile(deploymentPath, JSON.stringify(data, null, 2));
});

async function _verify(contractAddress) {
  await hre.run('verify:verify', {
    address: contractAddress,
    apiKey: `${process.env.ETHERSCAN_API}`,
    constructorArguments: Object.values(hre.config.defaults),
  });
  console.log('Verified');
}

async function _confirmParameters() {
  console.log('Constructor parameters:');
  _logObject(hre.config.defaults);
  console.log('');

  console.log('Overrides:');
  _logObject(hre.config.overrides);
  console.log('');
}

async function _deployContract() {
  const factory = await hre.ethers.getContractFactory('Ethernauts');
  const Ethernauts = await factory.deploy(
    ...Object.values(hre.config.defaults),
    hre.config.overrides
  );
  console.log('Submitted transaction:', Ethernauts.deployTransaction);

  const receipt = await Ethernauts.deployTransaction.wait();
  console.log('Deployment receipt:', receipt);

  return Ethernauts;
}

function _logObject(obj) {
  const newObj = {};

  Object.keys(obj).map((key) => {
    newObj[key] = obj[key].toString();
  });

  console.log(newObj);
}

function _loadOrCreateDeploymentFile(filepath) {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath));
  } else {
    return DEPLOYMENT_SCHEMA;
  }
}
