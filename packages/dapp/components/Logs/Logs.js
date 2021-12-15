import { useState } from 'react';

import logs from '../../data/ethernaut-logs.json';

import { LeftArrow } from '../Icons/LeftArrow';
import { RightArrow } from '../Icons/RightArrow';

import styles from './styles.module.scss';

const Logs = () => {
  const [index, setIndex] = useState(0);

  const handleNextLog = () => {
    const limit = logs.length - 1;
    if (index < limit) {
      setIndex(index + 1);
    }
  };

  const handlePreviousLog = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const log = logs[index];
  const logNumber = index + 1;

  return (
    <section className={styles.container}>
      <div className={styles.text}>
        <h3 className={styles.title}>{log.title}</h3>
        <p className={styles.location}>{`Location: ${log.location}`}</p>
        <p className={styles.text}>{log.text}</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.button} onClick={handlePreviousLog}>
          <LeftArrow />
        </button>
        <span className={styles.entry}>{`Entry ${logNumber}`}</span>
        <button className={styles.button} onClick={handleNextLog}>
          <RightArrow />
        </button>
      </div>
    </section>
  );
};

export default Logs;
