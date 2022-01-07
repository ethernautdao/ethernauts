import cn from 'classnames';

import { Background } from '../Background';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
  <>
    <Background />
    <main className={cn(styles.main)}>{children}</main>
  </>
);

export default Layout;
