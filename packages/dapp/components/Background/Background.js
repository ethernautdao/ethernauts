import styles from './Background.module.scss';

const Background = () => (
  <div className={styles.bgWrap}>
    <img className={styles.img} src={'/assets/dark-background.png'} alt="backgound image" />
  </div>
);

export default Background;
