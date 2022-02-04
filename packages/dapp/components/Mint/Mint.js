import cn from 'classnames';
import useBreakpoint from 'use-breakpoint';

import { BREAKPOINTS } from '../../constants/common';

import { Logs } from '../Logs';
import { DonationSlide } from '../DonationSlide';
import { Mint as MintButton } from '../Buttons/Mint';
import { AvailableToMint } from '../AvailableToMint';

import styles from './Mint.module.scss';

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
            <img src={'/assets/card-image.jpg'} className={styles.image} />
          </div>
          <div className={cn(styles.row, styles.secondRow)}>
            <DonationSlide />
          </div>
          <div className={cn(styles.row, styles.lastRow)}>
            <MintButton />
          </div>
          <AvailableToMint />
        </div>
      </div>
    </section>
  );
};

export default Mint;
