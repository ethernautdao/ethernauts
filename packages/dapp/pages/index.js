import Head from 'next/head';
import cn from 'classnames';

import { Mint } from '../components/Buttons/Mint';
import { DonationSlide } from '../components/DonationSlide';
import { Logs } from '../components/Logs';

import styles from './index.module.scss';

export const Home = () => (
  <div className={styles.outerContainer}>
    <Head>
      <title>EthernautDAO</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <section className={styles.innerContainer}>
      <div className={cn(styles.column, styles.rightColumn)}>
        <div className={cn(styles.row, styles.firstRow)}>
          <img src="https://via.placeholder.com/550" className={styles.image} />
        </div>
        <div className={cn(styles.row, styles.secondRow)}>
          <DonationSlide />
        </div>
        <div className={cn(cn(styles.row, styles.lastRow))}>
          <Mint />
        </div>
      </div>
      <div className={cn(styles.column, styles.leftColumn, styles.borderLeft)}>
        <Logs />
      </div>
    </section>
  </div>
);

export default Home;
