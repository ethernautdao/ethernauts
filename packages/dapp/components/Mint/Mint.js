import Image from 'next/image';
import cn from 'classnames';

import CardImage from '../../public/assets/card-image.png';

import { Mint as MintButton } from '../Buttons/Mint';
import { DonationSlide } from '../DonationSlide';
import { Logs } from '../Logs';

import styles from './Mint.module.scss';

const Mint = () => (
  <section className={styles.outerContainer}>
    <div className={styles.innerContainer}>
      <div className={cn(styles.column, styles.leftColumn)}>
        <Logs />
      </div>
      <div className={cn(styles.column, styles.rightColumn)}>
        <div className={cn(styles.row, styles.firstRow)}>
          <Image src={CardImage} className={styles.image} />
        </div>
        <div className={cn(styles.row, styles.secondRow)}>
          <DonationSlide />
        </div>
        <div className={cn(cn(styles.row, styles.lastRow))}>
          <MintButton />
        </div>
      </div>
    </div>
  </section>
);

export default Mint;
