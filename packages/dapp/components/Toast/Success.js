import cn from 'classnames';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { GALLERY_ME_PATH } from '../../constants/routes';

import { Close } from '../Icons/Close';
import { Success as SuccessIcon } from '../Icons/Toast/Success';

import styles from './Toast.module.scss';

const Success = ({ t }) => (
  <div className={cn(styles.container, styles.success)}>
    <div className={styles.titleContainer}>
      <SuccessIcon className={styles.statusIcon} />
      <p className={styles.title}>Success</p>
      <button className={styles.closeButton} onClick={() => toast.dismiss(t.id)}>
        <Close />
      </button>
    </div>
    <p className={styles.text}>You successfully minted your Ethernaut NFT.</p>
    <Link href={GALLERY_ME_PATH} passHref>
      <a className={styles.link}>View in your gallery</a>
    </Link>
  </div>
);

export default Success;
