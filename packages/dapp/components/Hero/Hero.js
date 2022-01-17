import cn from 'classnames';
import { useRouter } from 'next/router';
import useBreakpoint from 'use-breakpoint';

import { BREAKPOINTS } from '../../constants/common';
import { MAIN_ROUTES, GALLERY_ROUTES } from '../../constants/routes';

import styles from './Hero.module.scss';

const heroKind = {
  [MAIN_ROUTES.home.path]: <img src={'/assets/ethernaut-home-title.svg'} />,
  [GALLERY_ROUTES.all.path]: <img src={'/assets/ethernaut-gallery-title.svg'} />,
  [GALLERY_ROUTES.me.path]: <img src={'/assets/ethernaut-gallery-title.svg'} />,
};

const Hero = () => {
  const { asPath } = useRouter();
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

  const isMobile = breakpoint === 'mobile';

  return <h1 className={cn(styles.title, { [styles.mobile]: isMobile })}>{heroKind[asPath]}</h1>;
};

export default Hero;
