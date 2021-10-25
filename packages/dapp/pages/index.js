import Head from 'next/head';
import { useEffect } from 'react';

import { AvailableSupply } from '../components/AvailableSupply';
import { Mint } from '../components/Buttons/Mint';

import styles from './index.module.scss';

export const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>EthernautDAO</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <section>
      <AvailableSupply />
    </section>
    <section>
      <Mint />
    </section>
  </div>
);

export default Home;
