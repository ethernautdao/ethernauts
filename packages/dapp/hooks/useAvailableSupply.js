import { useCallback, useContext, useState } from 'react';
import { Contract } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';

import { abi, tokenAddress } from '../config';

const useAvailableSupply = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchAvailableSupply = useCallback(async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(tokenAddress, abi, signer);

        const supply = await contract.availableSupply();

        setData(supply.toString());
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
    setIsLoading(false);
  }, [state.web3Provider]);

  return [{ data, isLoading, isError }, fetchAvailableSupply];
};

export default useAvailableSupply;
