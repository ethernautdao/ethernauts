import { useContext, useState, useCallback } from 'react';
import { Contract } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';

import { ABI, CONTRACT_ADDRESS } from '../config';
import { saleState, COMPLETED } from '../constants/sale-state';

import isSupportedNetwork from '../helpers/is-supported-network';

const useSaleState = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchSaleState = useCallback(async () => {
    if (!isSupportedNetwork(state.chainId)) return;

    if (state.web3Provider) {
      try {
        setIsError(false);
        setIsLoading(true);
        if (state.web3Provider) {
          const signer = state.web3Provider.getSigner();

          const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

          const availableToMint = await contract.availableToMint();

          if (availableToMint.toNumber() === 0) {
            setData(COMPLETED);
            return;
          }

          const currentSaleState = await contract.currentSaleState();

          setData(saleState[Number(currentSaleState)]);
        }
      } catch (err) {
        console.error(err);
        setIsError(err.message);
      }
      setIsLoading(false);
    }
  }, [state.web3Provider, state.chainId]);

  return [{ data, isLoading, isError }, fetchSaleState];
};

export default useSaleState;
