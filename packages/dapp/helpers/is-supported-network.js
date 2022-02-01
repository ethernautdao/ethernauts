import { DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../constants/networks';

const isSupportedNetwork = (chainId) => {
  const defaultChainId = DEFAULT_NETWORKS_PER_ENVIRONMENT[process.env.NEXT_PUBLIC_APP_ENV];

  return chainId === defaultChainId;
};

export default isSupportedNetwork;
