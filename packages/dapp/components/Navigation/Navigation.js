import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GALLERY_ALL_PATH, GALLERY_ME_PATH, HOME_PATH, ABOUT_PATH, DONATE_PATH } from '../../constants/routes';

import styles from './Navigation.module.scss';

const Navigation = ({ routes }) => {
  const { asPath } = useRouter({ shallow: true });

  const paths = Object.values(routes);

  return (
    <nav className={cn(styles.nav)}>
      {paths.map(({ path, text, menuanchor }) => {
        const isGalleryPath =
          [GALLERY_ME_PATH, GALLERY_ALL_PATH].includes(asPath) && path !== HOME_PATH && path !== ABOUT_PATH && path !== DONATE_PATH;

        return (
          <Link key={text} href={path} passHref>
            <a
              data-menuanchor={menuanchor}
              className={cn(styles.link, {
                [styles.active]: path === asPath && isGalleryPath,
              })}
            >
              {text}
            </a>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
