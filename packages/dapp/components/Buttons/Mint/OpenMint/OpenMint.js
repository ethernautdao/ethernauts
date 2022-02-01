import { useEffect } from 'react';

import useMint from '../../../../hooks/useMint';

import { Toast, notify } from '../../../Toast';
import { SUCCESS_KIND, ERROR_KIND } from '../../../Toast/Kind';

import { Primary } from '../../Primary';

const OpenMint = () => {
  const [{ data, isLoading, isError }, fetchMint] = useMint();

  useEffect(() => {
    if (!data) return;

    notify({ kind: SUCCESS_KIND });
  }, [data]);

  useEffect(() => {
    if (!isError) return;

    notify({ kind: ERROR_KIND });
  }, [isError]);

  if (isLoading) return <Primary isDisabled fullWidth text="Pending transaction..." />;

  return (
    <>
      <Primary fullWidth onClick={fetchMint} text="Donate and mint your NFT" />
      <Toast />
    </>
  );
};

export default OpenMint;
