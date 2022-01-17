import cn from 'classnames';
import useBreakpoint from 'use-breakpoint';

import { BREAKPOINTS } from '../../constants/common';

import { Mint as MintButton } from '../Buttons/Mint';
import { DonationSlide } from '../DonationSlide';
import { Logs } from '../Logs';

import styles from './Mint.module.scss';
import AvailableSupply from '../AvailableSupply/AvailableSupply';

const Mint = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

  const isMobile = breakpoint === 'mobile';

  return (
    <section className={styles.outerContainer}>
      <div className={cn(styles.innerContainer, { [styles.mobileInnerContainer]: isMobile })}>
        <div className={cn(styles.column, { [styles.hide]: isMobile })}>
          <Logs />
        </div>
        <div className={cn(styles.column, styles.rightColumn, { [styles.fullWidth]: isMobile })}>
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
};

export default Mint;
