import { Header } from '../Header';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
  <main className={styles.main}>
    <Header />
    {children}
  </main>
);

export default Layout;
