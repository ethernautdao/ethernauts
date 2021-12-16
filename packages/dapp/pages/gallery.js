import Head from 'next/head';
import cn from 'classnames';

import { Gallery } from '../components/Gallery';

import styles from './index.module.scss';

const GalleryPage = () => {
  return (
    <div>
      <Head>
        <title>EthernautDAO - Gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className={styles.outerContainer}>
        <Gallery showAllItems />
      </section>
    </div>
  );
};

export default GalleryPage;
