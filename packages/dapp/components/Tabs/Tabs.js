import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './Tabs.module.scss';

const Tabs = ({ routes }) => {
  const { asPath } = useRouter();

  const paths = Object.values(routes);

  return (
    <nav className={styles.tab}>
      {paths.map(({ path, text }) => (
        <Link key={text} href={path} passHref>
          <a
            className={cn(styles.link, {
              [styles.active]: path === asPath,
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
