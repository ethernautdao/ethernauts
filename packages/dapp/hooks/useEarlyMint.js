import { useContext, useState } from 'react';
import { Contract, utils } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';

import { abi, tokenAddress, ethereumNetwork } from '../config';

import { zeroAccount } from '../constants';

const useMintEarly = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchMintEarly = async (value) => {
    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(tokenAddress, abi, signer);

        const signedCoupons = (await import(`../data/signed-coupons.${ethereumNetwork}.json`))
          .default;

        const signedCoupon = signedCoupons.find((signedCoupon) => {
          const [address] = Object.keys(signedCoupon);
          return address === state.address;
        });

        if (!signedCoupon) throw new Error(`You're not able to mint in this state`);

        const isARedeemedCoupon = await contract.userRedeemedCoupon(state.address);

        if (isARedeemedCoupon) throw new Error(`You're trying to use a redeemed coupon`);

        await contract.mintEarly(signedCoupon[state.address], {
          value: utils.parseEther('0.015'),
        });

        contract.on('Transfer', async (from, to, amount, evt) => {
          if (from !== zeroAccount) return;
          if (to !== state.address) return;

          const tokenId = evt.args.tokenId.toString();

          setData(tokenId);

          setIsLoading(false);
        });
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
