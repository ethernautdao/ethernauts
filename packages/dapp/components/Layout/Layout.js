import cn from 'classnames';
import { useRouter } from 'next/router';

import useSwitchNetwork from '../../hooks/useSwitchNetwork';
import useIsWindowFocused from '../../hooks/useIsWindowFocused';

import { GALLERY_ALL_PATH, GALLERY_ME_PATH } from '../../constants/routes';

import { Background } from '../Background';
import { Footer } from '../Footer';

import styles from './Layout.module.scss';

const Layout = ({ children }) => {
  const { asPath } = useRouter();
  const windowIsActive = useIsWindowFocused();

  useSwitchNetwork(windowIsActive);

  const isGallery = [GALLERY_ALL_PATH, GALLERY_ME_PATH].includes(asPath);

  return (
    <div className={styles.mainContainer}>
      <Background />
      <main className={cn(styles.main, { [styles.minHeight]: isGallery })}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
