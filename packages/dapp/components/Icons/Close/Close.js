import styles from './Close.module.scss';

const Close = (props) => (
  <svg
    className={styles.svg}
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill="none"
    viewBox="0 0 28 28"
    {...props}
  >
    <path
      fill="#ADBDCC"
      d="M8.974 8L8 8.974 13.026 14 8 19.026l.974.974L14 14.974 19.026 20l.974-.974L14.974 14 20 8.974 19.026 8 14 13.026 8.974 8z"
      opacity="0.6"
    ></path>
  </svg>
);

export default Close;
