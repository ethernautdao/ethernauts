import Head from 'next/head';

import { Tabs } from '../../components/Tabs';
import { Hero } from '../../components/Hero';
import { Header } from '../../components/Header';
import { Gallery } from '../../components/Gallery';

import { GALLERY_ROUTES } from '../../constants/routes';

import styles from '../index.module.scss';

const GalleryPage = () => {
  return (
    <>
      <Head>
        <title>EthernautDAO - Gallery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <section className={styles.outerContainer}>
        <Hero />
        <Tabs routes={GALLERY_ROUTES} />
        <Gallery />
      </section>
    </>
  );
};

export default GalleryPage;
