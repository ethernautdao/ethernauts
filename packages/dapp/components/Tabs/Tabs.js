import { useContext } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { GALLERY_ME_PATH } from '../../constants/routes';
import { WalletContext } from '../../contexts/WalletProvider';

import styles from './Tabs.module.scss';

const Tabs = ({ routes }) => {
  const { asPath } = useRouter();
  const { state } = useContext(WalletContext);

  const paths = Object.values(routes);

  return (
    <nav className={styles.tab}>
      {paths.map(({ path, text }) => (
        <Link key={text} href={path} passHref>
          <a
            onClick={(e) => {
              if (!state.address && path === GALLERY_ME_PATH) {
                e.preventDefault();
              }
            }}
            className={cn(styles.link, {
              [styles.active]: path === asPath,
              [styles.disabled]: !state.address && path === GALLERY_ME_PATH,
            })}
          >
            {text}
          </a>
        </Link>
      ))}
    </nav>
  );
};

export default Tabs;
