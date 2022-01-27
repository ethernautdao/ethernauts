import { useEffect } from 'react';

import useAvailableToMint from '../../hooks/useAvailableToMint';

import styles from './AvailableToMint.module.scss';

const AvailableToMint = () => {
  const [{ data, isLoading, isError }, fetchAvailableToMint] = useAvailableToMint();

  useEffect(() => {
    fetchAvailableToMint();
  }, []);

  if (isLoading) return <span className={styles.fetchAvailableToMint}>Loading...</span>;

  if (isError) return <span className={styles.fetchAvailableToMint}>Something went wrong</span>;

  return (
    <p className={styles.fetchAvailableToMint}>
      <span className={styles.number}>{data}</span>/10000 NFTs minted
    </p>
  );
};

export default AvailableToMint;
