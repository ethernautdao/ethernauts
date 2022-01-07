import { useEffect } from 'react';

import useMintEarly from '../../../../hooks/useEarlyMint';

import { Toast, notify } from '../../../Toast';

import { SUCCESS_KIND, ERROR_KIND } from '../../../Toast/Kind';

import { Primary } from '../../Primary';

const EarlyMint = () => {
  const [{ data, isLoading, isError }, fetchMintEarly] = useMintEarly();

  useEffect(() => {
    if (!data) return;

    notify({ kind: SUCCESS_KIND });
  }, [data]);

  useEffect(() => {
    if (!isError) return;

    notify({ kind: ERROR_KIND });
  }, [isError]);

  if (isLoading) return <Primary isDisabled fullWidth text="Loading..." />;

  return (
    <>
      <Primary fullWidth onClick={fetchMintEarly} text="Donate and mint your NFT" />
      <Toast />
    </>
  );
};

export default EarlyMint;
