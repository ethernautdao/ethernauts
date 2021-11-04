import { abi } from '../../packages/hardhat/artifacts/contracts/Ethernauts.sol/Ethernauts.json';

const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const ethereumNetwork = process.env.NEXT_PUBLIC_ETHEREUM_NETWORK;

export { tokenAddress, ethereumNetwork, abi };
