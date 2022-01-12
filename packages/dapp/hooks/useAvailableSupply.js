import { useCallback, useContext, useState } from 'react';
import { Contract } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';

import { abi, tokenAddress } from '../config';
import { zeroAccount } from '../constants';

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

        const maxTokens = await contract.maxTokens();
        const supply = await contract.availableSupply();

        contract.on('Transfer', async (from) => {
          if (from !== zeroAccount) return;

          setIsLoading(true);

          const supply = await contract.availableSupply();

          setData(maxTokens.toNumber() - supply.toNumber());

          setIsLoading(false);
        });

        setData(maxTokens.toNumber() - supply.toNumber());
      }
    } catch (err) {
      console.error(err);
      setIsError(err.message);
    }
    setIsLoading(false);
  }, [state.web3Provider]);

  return [{ data, isLoading, isError }, fetchAvailableSupply];
};

export default useAvailableSupply;
