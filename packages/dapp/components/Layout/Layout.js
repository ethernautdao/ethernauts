import styles from './Layout.module.scss';

const Layout = ({ children }) => <main className={styles.main}>{children}</main>;

export default Layout;
