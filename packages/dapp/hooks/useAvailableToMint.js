import { providers } from 'ethers';
import { useState } from 'react';
import { Contract } from 'ethers';

import { ABI, CONTRACT_ADDRESS } from '../config';

import { DEFAULT_NETWORKS_PER_ENVIRONMENT } from '../constants/networks';

import getChainData from '../helpers/get-chain-data';

const useAvailableToMint = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultChainId = DEFAULT_NETWORKS_PER_ENVIRONMENT[process.env.NEXT_PUBLIC_APP_ENV];

  const { rpcUrl } = getChainData(defaultChainId);

  const fetchAvailableToMint = async () => {
    try {
      setIsError(false);
      setIsLoading(true);

      const provider = new providers.JsonRpcProvider(rpcUrl);

      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const availableToMint = await contract.availableToMint();

      setData(availableToMint.toNumber());
    } catch (err) {
      console.error(err);
      setIsError(err.message);
    }
    setIsLoading(false);
  };

  return [{ data, isLoading, isError }, fetchAvailableToMint];
};

export default useAvailableToMint;
