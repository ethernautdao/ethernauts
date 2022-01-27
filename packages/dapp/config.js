const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development';

console.info('NEXT_PUBLIC_APP_ENV: ', process.env.NEXT_PUBLIC_APP_ENV);

let CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const CONTRACT_BLOCK = Number(process.env.NEXT_PUBLIC_CONTRACT_BLOCK) ?? 0;
const ETHEREUM_NETWORK = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;

const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const FLEEK_BUCKET_ID = process.env.NEXT_PUBLIC_FLEEK_BUCKET_ID;

if (!CONTRACT_ADDRESS && isDev) {
  (async () => {
    const { token } = require('@ethernauts/hardhat/deployments/docker.json');

    CONTRACT_ADDRESS = token;
  })();
}

let ABI = null;
if (isDev) {
  ABI = require('@ethernauts/hardhat/artifacts/contracts/Ethernauts.sol/Ethernauts.json').abi;
} else {
  ABI = JSON.parse(process.env.NEXT_PUBLIC_CONTRACT_ABI);
}

export {
  CONTRACT_ADDRESS,
  CONTRACT_BLOCK,
  ETHEREUM_NETWORK,
  INFURA_PROJECT_ID,
  FLEEK_BUCKET_ID,
  ABI,
  isDev,
};
