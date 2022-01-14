const isDev = process.env.NODE_ENV === 'development';

let TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const ETHEREUM_NETWORK = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;

if (!TOKEN_ADDRESS && isDev) {
  (async () => {
    const { token } = require('@ethernauts/hardhat/deployments/docker.json');

    TOKEN_ADDRESS = token;
  })();
}

let ABI = null;
if (isDev) {
  ABI = require('@ethernauts/hardhat/artifacts/contracts/Ethernauts.sol/Ethernauts.json').abi;
} else {
  ABI = JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI);
  console.log('ABI: ', ABI);
}

export { TOKEN_ADDRESS, ETHEREUM_NETWORK, INFURA_PROJECT_ID, ABI };
