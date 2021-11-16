import { abi } from '@ethernauts/hardhat/artifacts/contracts/Ethernauts.sol/Ethernauts.json';

const isDev = process.env.NODE_ENV === 'development';
let tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const ethereumNetwork = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;

if (!tokenAddress && isDev) {
  (async () => {
    const { token } = (await import('@ethernauts/hardhat/deployments/docker.json')).default;

    tokenAddress = token;

    console.info('tokenAddress: ', tokenAddress);
  })();
}

export { tokenAddress, ethereumNetwork, abi };
