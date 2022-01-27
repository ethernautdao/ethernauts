import { INFURA_PROJECT_ID } from '../config';
import { supportedChains } from '../constants/networks';

const getChainData = (chainId) => {
  if (!chainId) return null;

  const [chainData] = supportedChains.filter((chain) => chain.chainId === chainId);

  if (!chainData) {
    throw new Error('Unsupported Network');
  }

  if (chainData.rpcUrl.includes('infura.io') && chainData.rpcUrl.includes('%PROJECT_ID%')) {
    const rpcUrl = chainData.rpcUrl.replace('%PROJECT_ID%', INFURA_PROJECT_ID);

    return {
      ...chainData,
      rpcUrl,
    };
  }

  return chainData;
};

export default getChainData;
