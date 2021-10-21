import Head from 'next/head';

import { AvailableSupply } from '../components/AvailableSupply';
import { EarlyMint } from '../components/Buttons/EarlyMint';

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
      <EarlyMint />
    </section>
  </div>
);

export default Home;
