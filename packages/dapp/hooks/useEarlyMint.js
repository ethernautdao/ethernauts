import { useContext, useState } from 'react';
import { Contract, utils } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';
import { DonationContext } from '../contexts/DonationProvider';

import { ABI, CONTRACT_ADDRESS, ETHEREUM_NETWORK } from '../config';

import isSupportedNetwork from '../helpers/is-supported-network';

const useMintEarly = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);
  const { donation } = useContext(DonationContext);

  const fetchMintEarly = async () => {
    if (!isSupportedNetwork(state.chainId)) return;

    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

        const signedCoupons = require(`../data/signed-coupons.${ETHEREUM_NETWORK}.json`);

        const signedCoupon = signedCoupons.find((signedCoupon) => {
          const [address] = Object.keys(signedCoupon);
          return address.toLowerCase() === state.address.toLowerCase();
        });

        if (!signedCoupon)
          throw new Error(
            `You need to have valid community coupon to purchase during the early sale`
          );

        const isARedeemedCoupon = await contract.userRedeemedCoupon(state.address);

        if (isARedeemedCoupon) throw new Error(`You've redeemed your community sale coupon`);

        const tx = await contract.mintEarly(signedCoupon[state.address], {
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

  return [{ data, isLoading, isError }, fetchMintEarly];
};

export default useMintEarly;
