import Image from 'next/image';

import BackgroundImage from '../../public/assets/dark-background.png';

import styles from './Background.module.scss';

const Background = () => (
  <div className={styles.bgWrap}>
    <Image src={BackgroundImage} layout="fill" objectFit="cover" />
  </div>
);

export default Background;
