import { useRouter } from 'next/router';

import styles from './Hero.module.scss';

import { MAIN_ROUTES, GALLERY_ROUTES } from '../../constants/routes';

const heroKind = {
  [MAIN_ROUTES.home.path]: <img src={'/assets/ethernaut-home-title.svg'} />,
  [GALLERY_ROUTES.all.path]: <img src={'/assets/ethernaut-gallery-title.svg'} />,
  [GALLERY_ROUTES.me.path]: <img src={'/assets/ethernaut-gallery-title.svg'} />,
};

const Hero = () => {
  const { asPath } = useRouter();
  return <h1 className={styles.title}>{heroKind[asPath]}</h1>;
};

export default Hero;
