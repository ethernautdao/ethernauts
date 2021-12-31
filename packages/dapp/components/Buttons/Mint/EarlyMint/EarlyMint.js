import { useEffect } from 'react';

import useMintEarly from '../../../../hooks/useEarlyMint';

import { Toast, notify } from '../../../Toast';
import { Error } from '../../Error';
import { Primary } from '../../Primary';

const EarlyMint = () => {
  const [{ data, isLoading, isError }, fetchMintEarly] = useMintEarly();

  useEffect(() => {
    if (!data) return;
    notify();
  }, [data]);

  const isDisabled = isError || isLoading;

  if (isLoading) return <Primary isDisabled fullWidth text="Loading..." />;

  if (isError) return <Error isDisabled fullWidth text="Something went wrong" />;

  return (
    <>
      <Primary
        fullWidth
        isDisabled={isDisabled}
        onClick={fetchMintEarly}
        text="Donate and mint your NFT"
      />
      <Toast />
    </>
  );
};

export default EarlyMint;
