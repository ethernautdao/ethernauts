import cn from 'classnames';

import styles from './Primary.module.scss';

const Primary = ({ text, isDisabled, fullWidth, onClick }) => (
  <button
    type="button"
    disabled={isDisabled}
    onClick={onClick}
    className={cn(styles.button, { [styles.fullWidth]: fullWidth })}
  >
    <span className={styles.text}>{text}</span>
  </button>
);

export default Primary;
