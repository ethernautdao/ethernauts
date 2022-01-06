import { useEffect } from 'react';
import useMint from '../../../../hooks/useMint';

import { Toast, notify } from '../../../Toast';
import { Error } from '../../Error';
import { Primary } from '../../Primary';

const OpenMint = () => {
  const [{ data, isLoading, isError }, fetchMint] = useMint();

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
        onClick={fetchMint}
        text="Donate and mint your NFT"
      />
      <Toast />
    </>
  );
};

export default OpenMint;
