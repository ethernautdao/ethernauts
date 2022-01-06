import Image from 'next/image';
import Title from '../../public/assets/ethernaut-title.svg';

import styles from './Hero.module.scss';

const Hero = () => (
  <h1 className={styles.title}>
    <Image src={Title} />
  </h1>
);

export default Hero;
