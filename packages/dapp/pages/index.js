import Head from 'next/head';
import Image from 'next/image';
import cn from 'classnames';

import { Logs } from '../components/Logs';
import { Gallery } from '../components/Gallery';
import { Mint } from '../components/Buttons/Mint';
import { DonationSlide } from '../components/DonationSlide';

import styles from './index.module.scss';

export const HomePage = () => (
  <>
    <Head>
      <title>EthernautDAO</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <section className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <div className={cn(styles.column, styles.rightColumn)}>
          <div className={cn(styles.row, styles.firstRow)}>
            <Image
              src="https://via.placeholder.com/550"
              layout="fill"
              objectFit="cover"
              className={styles.image}
            />
          </div>
          <div className={cn(styles.row, styles.secondRow)}>
            <DonationSlide />
          </div>
          <div className={cn(styles.row, styles.lastRow)}>
            <Mint />
          </div>
        </div>
        <div className={cn(styles.column, styles.leftColumn, styles.borderLeft)}>
          <Logs />
        </div>
      </div>
    </section>
    <section className={styles.outerContainer}>
      <Gallery />
    </section>
  </>
);

export default HomePage;
