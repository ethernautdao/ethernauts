import cn from 'classnames';

import { Mint as MintButton } from '../Buttons/Mint';
import { DonationSlide } from '../DonationSlide';
import { Logs } from '../Logs';

import styles from './Mint.module.scss';
import AvailableSupply from '../AvailableSupply/AvailableSupply';

const Mint = () => (
  <section className={styles.outerContainer}>
    <div className={styles.innerContainer}>
      <div className={cn(styles.column, styles.leftColumn)}>
        <Logs />
      </div>
      <div className={cn(styles.column, styles.rightColumn)}>
        <div className={cn(styles.row, styles.firstRow)}>
          <img src={'/assets/card-image.png'} className={styles.image} />
        </div>
        <div className={cn(styles.row, styles.secondRow)}>
          <DonationSlide />
        </div>
        <div className={cn(styles.row, styles.lastRow)}>
          <MintButton />
          <AvailableSupply />
        </div>
      </div>
    </div>
  </section>
);

export default Mint;
