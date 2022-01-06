import cn from 'classnames';

import styles from './Error.module.scss';

const Error = ({ text, fullWidth }) => {
  return (
    <button type="button" disabled className={cn(styles.button, { [styles.fullWidth]: fullWidth })}>
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default Error;
