import Link from 'next/link';
import { useContext } from 'react';

import { WalletContext } from '../../../contexts/WalletProvider';

import styles from './GoToGallery.module.scss';

const GoToGallery = () => {
  const { state } = useContext(WalletContext);

  const isConnected = state.web3Provider !== null;

  if (!isConnected) return null;

  return (
    <div className={styles.container}>
      <Link href="/gallery">
        <a className={styles.button}>Go to Gallery</a>
      </Link>
    </div>
  );
};

export default GoToGallery;
