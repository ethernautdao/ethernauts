import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { GALLERY_ROUTES } from '../../constants/routes';

import useGallery from '../../hooks/useGallery';

import { Loader } from '../Loader';

import { Grid, ALL, ME } from './Grid';

const Gallery = () => {
  const { asPath } = useRouter();

  const [{ data, isLoading, isError }, fetchGalleryItems] = useGallery();

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  if (isLoading) return <Loader />;

  if (isError) return 'Something went wrong...';

  const isAll = asPath === GALLERY_ROUTES.all.path;

  if (isAll) {
    return <Grid items={data?.allGalleryItems} kind={ALL} />;
  } else {
    return <Grid items={data?.myGalleryItems} kind={ME} />;
  }
};

export default Gallery;
