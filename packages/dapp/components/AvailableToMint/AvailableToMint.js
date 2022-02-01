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

  if (data === 0) return null;

  return (
    <p className={styles.fetchAvailableToMint}>
      <span className={styles.number}>{data}</span> NFTs available to mint
    </p>
  );
};

export default AvailableToMint;
