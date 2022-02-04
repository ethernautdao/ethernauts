import { useContext, useEffect } from 'react';

import useMint from '../../../../hooks/useMint';
import { WalletContext } from '../../../../contexts/WalletProvider';

import { Toast, notify } from '../../../Toast';
import { SUCCESS_KIND, ERROR_KIND } from '../../../Toast/Kind';

import { Primary } from '../../Primary';

const OpenMint = () => {
  const { setBalance } = useContext(WalletContext);
  const [{ data, isLoading, isError }, fetchMint] = useMint();

  useEffect(() => {
    if (!data) return;

    notify({ kind: SUCCESS_KIND });
  }, [data]);

  useEffect(() => {
    if (!isError) return;

    notify({ kind: ERROR_KIND });
  }, [isError]);

  const handleClick = async () => {
    await fetchMint();
    await setBalance();
  };

  if (isLoading) return <Primary isDisabled fullWidth text="Pending transaction..." />;

  return (
    <>
      <Primary fullWidth onClick={handleClick} text="Donate and mint your NFT" />
      <Toast />
    </>
  );
};

export default OpenMint;
