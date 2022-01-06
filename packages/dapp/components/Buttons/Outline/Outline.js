import styles from './Outline.module.scss';

const Outline = ({ text, onClick, ...rest }) => (
  <div onClick={onClick} className={styles.container}>
    <button className={styles.scroll} {...rest}>
      <span className={styles.text}>{text}</span>
    </button>
  </div>
);

export default Outline;
