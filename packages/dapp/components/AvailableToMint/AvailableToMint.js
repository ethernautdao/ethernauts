import { useEffect } from 'react';

import useAvailableToMint from '../../hooks/useAvailableToMint';

import styles from './AvailableToMint.module.scss';

const AvailableToMint = () => {
  const [{ data, isLoading, isError }, fetchAvailableToMint] = useAvailableToMint();

  useEffect(() => {
    fetchAvailableToMint();
  }, []);

  if (isLoading) return <p className={styles.fetchAvailableToMint}>Loading...</p>;

  if (isError) return <p className={styles.fetchAvailableToMint}>Something went wrong</p>;

  if (data === 0) return null;

  return (
    <p className={styles.fetchAvailableToMint}>
      <span className={styles.number}>{data}</span> NFTs available to mint
    </p>
  );
};

export default AvailableToMint;
