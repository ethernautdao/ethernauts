import cn from 'classnames';

import styles from './Disabled.module.scss';

const Disabled = ({ text, fullWidth, notElegible }) => {
  return (
    <button
      type="button"
      disabled
      className={cn(styles.button, {
        [styles.fullWidth]: fullWidth,
        [styles.notElegible]: notElegible,
      })}
    >
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default Disabled;
