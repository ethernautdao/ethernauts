import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

const HOME_PATH = '/';
const GALLERY_PATH = '/gallery';

const Navigation = () => {
  const router = useRouter();
  const { asPath } = router;

  return (
    <nav className={styles.nav}>
      <Link href="/" passHref>
        <a className={cn(styles.link, { [styles.active]: asPath === HOME_PATH })}>Home</a>
      </Link>
      <Link href="/gallery" passHref>
        <a className={cn(styles.link, { [styles.active]: asPath === GALLERY_PATH })}>Gallery</a>
      </Link>
    </nav>
  );
};

export default Navigation;
