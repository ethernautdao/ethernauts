import {
  INFURA_PROJECT_ID,
  DEFAULT_NETWORKS_PER_ENVIRONMENT,
  supportedChains,
} from '../constants/networks';

const getChainData = (chainId) => {
  if (!chainId) return null;

  const [chainData] = supportedChains.filter((chain) => chain.chain_id.includes(chainId));

  if (!chainData) {
    throw new Error('Unsupported Network');
  }

  if (chainData.rpc_url.includes('infura.io') && chainData.rpc_url.includes('%PROJECT_ID%')) {
    const rpcUrl = chainData.rpc_url.replace('%PROJECT_ID%', INFURA_PROJECT_ID);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
};

export default getChainData;
