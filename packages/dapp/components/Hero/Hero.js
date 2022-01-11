import { useRouter } from 'next/router';
import Image from 'next/image';

import HomeTitle from '../../public/assets/ethernaut-home-title.svg';
import GalleryTitle from '../../public/assets/ethernaut-gallery-title.svg';

import styles from './Hero.module.scss';

import { MAIN_ROUTES, GALLERY_ROUTES } from '../../constants/routes';

const heroKind = {
  [MAIN_ROUTES.home.path]: <Image src={HomeTitle} />,
  [GALLERY_ROUTES.all.path]: <Image src={GalleryTitle} />,
  [GALLERY_ROUTES.me.path]: <Image src={GalleryTitle} />,
};

const Hero = () => {
  const { asPath } = useRouter();
  return <h1 className={styles.title}>{heroKind[asPath]}</h1>;
};

export default Hero;
