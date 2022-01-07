import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';

import { GALLERY_ROUTES } from '../../constants/routes';

import { WalletContext } from '../../contexts/WalletProvider';

import useGallery from '../../hooks/useGallery';

import { Grid, ALL, ME } from './Grid';

const Gallery = () => {
  const { asPath } = useRouter();
  const { state } = useContext(WalletContext);

  const [{ data, isLoading, isError }, fetchGalleryItems] = useGallery();

  useEffect(() => {
    if (state.web3Provider) fetchGalleryItems();
  }, [fetchGalleryItems]);

  if (isLoading) return 'Loading...';

  if (isError) return 'Something went wrong...';

  if (!state.web3Provider) return null;

  const isAll = asPath === GALLERY_ROUTES.all.path;

  if (isAll) {
    return <Grid items={data?.allGalleryItems} kind={ALL} />;
  } else {
    return <Grid items={data?.myGalleryItems} kind={ME} />;
  }
};

export default Gallery;
