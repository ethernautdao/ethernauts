import { Loader as LoaderIcon } from '../Icons/Loader';

import styles from './Loader.module.scss';

const Loader = () => (
  <div className={styles.rotate}>
    <LoaderIcon />
  </div>
);

export default Loader;
