import { useContext, useState } from 'react';
import { Contract, utils } from 'ethers';

import { WalletContext } from '../contexts/WalletProvider';

import { abi, tokenAddress } from '../config';
import { zeroAccount } from '../constants';

const signCouponForAddress = (address, signer) => {
  const payload = `0x000000000000000000000000${address.replace('0x', '')}`;
  const payloadHash = utils.keccak256(payload);
  const payloadHashBytes = utils.arrayify(payloadHash);
  return signer.signMessage(payloadHashBytes);
};

const useMintEarly = () => {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { state } = useContext(WalletContext);

  const fetchMintEarly = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      if (state.web3Provider) {
        const signer = state.web3Provider.getSigner();

        const contract = new Contract(tokenAddress, abi, signer);

        const coupon = await signCouponForAddress(state.address, signer);

        await contract.mintEarly(coupon, {
          value: utils.parseEther('0.015'),
        });

        contract.on('Transfer', async (from, to, amount, evt) => {
          if (from !== zeroAccount) return;
          const tokenId = evt.args.tokenId.toString();

          setData(tokenId);

          setIsLoading(false);
        });
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setIsError(true);
    }
  };

  return [{ data, isLoading, isError }, fetchMintEarly];
};

export default useMintEarly;
