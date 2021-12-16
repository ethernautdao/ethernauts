import Image from 'next/image';
import { useContext, useEffect } from 'react';

import { WalletContext } from '../../contexts/WalletProvider';

import useGallery from '../../hooks/useGallery';

import styles from './Gallery.module.scss';

const Gallery = ({ showAllItems }) => {
  const { state } = useContext(WalletContext);

  const [{ data, isLoading, isError }, fetchGalleryItems] = useGallery();

  useEffect(() => {
    if (state.web3Provider) fetchGalleryItems();
  }, [state.web3Provider, fetchGalleryItems]);

  if (isError) return 'Something went wrong...';

  if (isLoading) return 'Loading...';

  if (!state.web3Provider) return null;

  return (
    <div>
      <h3 className={styles.title}>Your NFTs</h3>
      <div className={styles.imageOuterContainer}>
        <div className={styles.myNFTsGrid}>
          {data?.myGalleryItems.map((item) => {
            return (
              <div key={item.args.tokenId.toString()} className={styles.imageInnerContainer}>
                <Image
                  // TODO: Use the URL of the fleek ipfs gateway to display the NFT
                  src="https://via.placeholder.com/470x220"
                  className={styles.image}
                  layout="fill"
                  objectFit="cover"
                />
                <span>{item.args.tokenId.toString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showAllItems && (
        <div>
          <h3 className={styles.title}>Gallery</h3>
          <div className={styles.imageOuterContainer}>
            <div className={styles.allNFTsGrid}>
              {data?.allGalleryItems.map((item) => {
                return (
                  <div key={item.args.tokenId.toString()} className={styles.imageInnerContainer}>
                    <Image
                      // TODO: Use the URL of the fleek ipfs gateway to display the NFT
                      src="https://via.placeholder.com/470x220"
                      className={styles.image}
                      layout="fill"
                      objectFit="cover"
                    />
                    <span>{item.args.tokenId.toString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
