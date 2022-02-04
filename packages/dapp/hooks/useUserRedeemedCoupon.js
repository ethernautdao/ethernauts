import { Contract } from 'ethers';
import { useContext, useState } from 'react';

import { WalletContext } from '../contexts/WalletProvider';

import { ABI, CONTRACT_ADDRESS } from '../config';

import isSupportedNetwork from '../helpers/is-supported-network';

const useUserRedeemedCoupon = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchUserRedeemedCoupon = async () => {
    if (!isSupportedNetwork(state.chainId)) return;

    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

        const isARedeemedCoupon = await contract.userRedeemedCoupon(state.address);

        setData(isARedeemedCoupon);

        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsError(err.message);
      setIsLoading(false);
    }
  };

  return [{ data, isLoading, isError }, fetchUserRedeemedCoupon];
};

export default useUserRedeemedCoupon;
