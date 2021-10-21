import supportedChains from './supported-chains';

const getChainData = (chainId) => {
  if (!chainId) return null;

  const [chainData] = supportedChains.filter((chain) => chain.chain_id === chainId);

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  // TODO: Use an environment variable
  const API_KEY = 'asktoknow';

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
};

export default getChainData;
