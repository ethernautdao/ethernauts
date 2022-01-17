import cn from 'classnames';

import useSwitchNetwork from '../../hooks/useSwitchNetwork';
import useIsWindowFocused from '../../hooks/useIsWindowFocused';

import { Background } from '../Background';

import styles from './Layout.module.scss';

const Layout = ({ children }) => {
  const windowIsActive = useIsWindowFocused();

  useSwitchNetwork(windowIsActive);

  return (
    <>
      <Background />
      <main className={cn(styles.main)}>{children}</main>
    </>
  );
};

export default Layout;
