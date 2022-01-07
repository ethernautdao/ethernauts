import { useContext, useEffect } from 'react';

import { WalletContext } from '../../contexts/WalletProvider';

import useAvailableSupply from '../../hooks/useAvailableSupply';

import styles from './AvailableSupply.module.scss';

const AvailableSupply = () => {
  const { state } = useContext(WalletContext);

  const [{ data, isLoading, isError }, fetchAvailableSupply] = useAvailableSupply();

  useEffect(() => {
    if (state.web3Provider) fetchAvailableSupply();
  }, [state.web3Provider, fetchAvailableSupply]);

  if (!state.web3Provider) return null;

  if (isLoading) return <span className={styles.availableSupply}>Loading...</span>;

  if (isError) return <span className={styles.availableSupply}>Something went wrong</span>;

  return (
    <p className={styles.availableSupply}>
      <span className={styles.number}>{data}</span>/10000 NFTs minted
    </p>
  );
};

export default AvailableSupply;
