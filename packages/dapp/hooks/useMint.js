import { useContext, useState } from 'react';
import { Contract, utils } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';
import { DonationContext } from '../contexts/DonationProvider';

import { ABI, CONTRACT_ADDRESS } from '../config';

import isSupportedNetwork from '../helpers/is-supported-network';

const useMint = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);
  const { donation } = useContext(DonationContext);

  const fetchMint = async () => {
    if (!isSupportedNetwork(state.chainId)) return;

    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

        const tx = await contract.mint({
          value: utils.parseEther(String(donation)),
        });

        const { transactionHash } = await tx.wait();

        setData(transactionHash);

        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setIsError(err.message);
      setIsLoading(false);
    }
  };

  return [{ data, isLoading, isError }, fetchMint];
};

export default useMint;
