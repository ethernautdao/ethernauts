import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

import styles from './Toast.module.scss';

const notify = () =>
  toast.custom(
    <div className={styles.container}>
      Your Ethernaut was minted{' '}
      <Link href="/gallery/me">
        <a className={styles.link}>View gallery</a>
      </Link>
    </div>
  );

const Toast = () => (
  <Toaster
    position="bottom-center"
    containerStyle={{ position: 'absolute', marginBottom: '10px' }}
    toastOptions={{
      duration: 50000,
    }}
  />
);

export default Toast;
export { notify };
