import { providers } from 'ethers';
import { useCallback, useContext, useState } from 'react';
import { Contract } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';

import { ABI, CONTRACT_ADDRESS } from '../config';

import { zeroAccount } from '../constants/common';
import { DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../constants/networks';

import getChainData from '../helpers/get-chain-data';

const useAvailableToMint = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const defaultChainId = DEFAULT_NETWORKS_PER_ENVIRONMENT[process.env.NEXT_PUBLIC_APP_ENV];

  const { rpcUrl } = getChainData(defaultChainId);

  const fetchAvailableToMint = async () => {
    try {
      setIsError(false);
      setIsLoading(true);

      const provider = new providers.JsonRpcProvider(rpcUrl);

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const availableToMint = await contract.availableToMint();
      const maxTokens = await contract.maxTokens();

      contract.on('Transfer', async (from) => {
        if (from !== zeroAccount) return;

        setIsLoading(true);

        const availableToMint = await contract.availableToMint();

        setData(maxTokens.toNumber() - availableToMint.toNumber());

        setIsLoading(false);
      });

      setData(maxTokens.toNumber() - availableToMint.toNumber());
    } catch (err) {
      console.error(err);
      setIsError(err.message);
    }
    setIsLoading(false);
  };

  return [{ data, isLoading, isError }, fetchAvailableToMint];
};

export default useAvailableToMint;
