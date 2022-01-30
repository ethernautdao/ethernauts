import { useEffect } from 'react';

import { WalletContext } from '../../../../contexts/WalletProvider';

import useMintEarly from '../../../../hooks/useEarlyMint';

import { Toast, notify } from '../../../Toast';
import { SUCCESS_KIND, ERROR_KIND } from '../../../Toast/Kind';

import { Primary } from '../../Primary';
import { Disabled } from '../../Disabled';

import { ETHEREUM_NETWORK } from '../../../../config';

const EarlyMint = () => {
  const { state } = useContext(WalletContext);
  const [{ data, isLoading, isError }, fetchMintEarly] = useMintEarly();

  const signedCoupons = require(`../../../../data/signed-coupons.${ETHEREUM_NETWORK}.json`);

  const signedCoupon = signedCoupons.find((signedCoupon) => {
    const [address] = Object.keys(signedCoupon);
    return address === state.address;
  });

  useEffect(() => {
    if (!data) return;

    notify({ kind: SUCCESS_KIND });
  }, [data]);

  useEffect(() => {
    if (!isError) return;

    notify({ kind: ERROR_KIND });
  }, [isError]);

  if (isLoading) return <Primary isDisabled fullWidth text="Pending transaction..." />;

  if (!signedCoupon)
    <>
      <Disabled fullWidth text="You're not able to mint in this state" />
    </>;

  return (
    <>
      <Primary fullWidth onClick={fetchMintEarly} text="Donate and mint your NFT" />
      <Toast />
    </>
  );
};

export default EarlyMint;
