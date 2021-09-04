const fs = require('fs');
const hre = require('hardhat');
const { ethers } = hre;

const DEPLOYMENT_SCHEMA = {
  token: ''
};

const PARAMETERS = {
  maxGiftable: 100,
  maxTokens: 10000,
  daoPercent: 950000,   // 95%
  artistPercent: 50000, // 5%
  provenanceHash: ethers.utils.id('beef') // TODO?
}

// TODO: Specify gas limit and price to use
// TODO: Specify owner/deployer EOA
async function main() {
  const deploymentPath = `./deployments/${hre.network.name}.json`;

  const data = _loadOrCreateDeploymentFile(deploymentPath);

  if (hre.network.name !== 'local' && data.token !== '') {
    throw new Error(`Token already exists at ${data.token}`);
  }

  const Ethernauts = await _deployContract();
  console.log(`Ethernauts token deployed at ${Ethernauts.address}`);

  data.token = Ethernauts.address;
  fs.writeFileSync(deploymentPath, JSON.stringify(data, null, 2));
}

async function _deployContract() {
  const factory = await ethers.getContractFactory('Ethernauts');
  const Ethernauts = await factory.deploy(...Object.values(PARAMETERS));
  console.log('Submitted transaction:', Ethernauts.deployTransaction);

  const receipt = await Ethernauts.deployTransaction.wait();
  console.log('Deployment receipt:', receipt);

  return Ethernauts;
}

function _loadOrCreateDeploymentFile(filepath) {
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath));
  } else {
    return DEPLOYMENT_SCHEMA;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
