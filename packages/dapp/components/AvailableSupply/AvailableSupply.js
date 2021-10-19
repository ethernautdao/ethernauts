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

  return (
    <>
      {isLoading && <span>Loading...</span>}
      {isError && <span>There was an unexpected error</span>}
      {data && <p className={styles.availableSupply}>There are {data} ethernauts available</p>}
    </>
  );
};

export default AvailableSupply;
