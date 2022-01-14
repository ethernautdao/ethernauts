import cn from 'classnames';

import useSwitchNetwork from '../../hooks/useSwitchNetwork';

import { Background } from '../Background';

import styles from './Layout.module.scss';

const Layout = ({ children }) => {
  useSwitchNetwork();

  return (
    <>
      <Background />
      <main className={cn(styles.main)}>{children}</main>
    </>
  );
};

export default Layout;
