import { useContext, useEffect } from 'react';
import Head from 'next/head';

import { WalletContext } from '../contexts/WalletProvider';

import useAvailableSupply from '../hooks/useAvailableSupply';
import useMintEarly from '../hooks/useEarlyMint';

import { EarlyMint } from '../components/Buttons/EarlyMint';

import styles from './index.module.scss';

export const Home = () => {
  const { state } = useContext(WalletContext);

  const [{ data, isLoading, isError }, fetchAvailableSupply] = useAvailableSupply();

  useEffect(() => {
    if (state.web3Provider) fetchAvailableSupply();
  }, [state.web3Provider, fetchAvailableSupply]);

  return (
    <div className={styles.container}>
      <Head>
        <title>EthernautDAO</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        {!!state.web3Provider && (
          <>
            {isLoading && <span>Loading...</span>}
            {isError && <span>There was an unexpected error</span>}
            {data && (
              <p className={styles.availableSupply}>There are {data} ethernauts available</p>
            )}
          </>
        )}
      </section>
      <section>
        <EarlyMint />
      </section>
    </div>
  );
};

export default Home;
