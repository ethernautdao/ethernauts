import { utils, BigNumber } from 'ethers';
import { useContext, useEffect } from 'react';

import { WalletContext } from '../contexts/WalletProvider';
import { OPTIMISM_NETWORKS, DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../constants/networks';

const useSwitchNetwork = () => {
  const { state } = useContext(WalletContext);

  const { web3Provider, address, chainId } = state;

  useEffect(async () => {
    if (!web3Provider || !chainId || !address) return;

    if (!web3Provider.provider || !web3Provider.provider.request) return;

    const defaultChainId = DEFAULT_NETWORKS_PER_ENVIRONMENT[process.env.NEXT_PUBLIC_APP_ENV];

    if (chainId === defaultChainId) return;

    const formattedChainId = utils.hexStripZeros(BigNumber.from(defaultChainId).toHexString());

    try {
      await web3Provider.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: formattedChainId }],
      });
    } catch (e) {
      if (e?.message?.includes('Unrecognized chain ID')) {
        await web3Provider.provider.request({
          method: 'wallet_addEthereumChain',
          params: [OPTIMISM_NETWORKS[formattedChainId]],
        });
      }
    }
  }, [web3Provider, chainId, address]);
};

export default useSwitchNetwork;
