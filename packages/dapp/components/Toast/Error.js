import cn from 'classnames';
import { toast } from 'react-hot-toast';

import { Close } from '../Icons/Close';
import { Error as ErrorIcon } from '../Icons/Toast/Error';

import styles from './Toast.module.scss';

const Error = ({ t }) => (
  <div className={cn(styles.container, styles.error)}>
    <div className={styles.titleContainer}>
      <ErrorIcon className={styles.statusIcon} />
      <p className={styles.title}>Error</p>
      <button className={styles.closeButton} onClick={() => toast.dismiss(t.id)}>
        <Close />
      </button>
    </div>
    <p className={styles.text}>Transaction failed. Please retry.</p>
  </div>
);

export default Error;
