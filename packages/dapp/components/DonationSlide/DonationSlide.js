import cn from 'classnames';
import Slider from 'rc-slider';
import useBreakpoint from 'use-breakpoint';
import { useContext, useEffect } from 'react';

import useSaleState from '../../hooks/useSaleState';

import { BREAKPOINTS } from '../../constants/common';

import { WalletContext } from '../../contexts/WalletProvider';
import { DonationContext } from '../../contexts/DonationProvider';

import { INITIAL_DONATION, MIN_DONATION, MAX_DONATION } from '../../constants/common';
import { EARLY } from '../../constants/sale-state';

import styles from './DonationSlide.module.scss';

const SelectDonation = () => {
  const { state } = useContext(WalletContext);
  const [{ data }, fetchSaleState] = useSaleState();
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');
  const { donation, setDonation } = useContext(DonationContext);

  const isMobile = breakpoint === 'mobile';

  useEffect(() => {
    if (state.web3Provider) fetchSaleState();
  }, [state.web3Provider, fetchSaleState]);

  const isEarlySale = EARLY === data;

  return (
    <>
      {isEarlySale && <h3 className={styles.earlyText}>Community Sale</h3>}
      <p className={styles.donationTitle}>Choose your donation amount</p>
      <Slider
        min={MIN_DONATION}
        max={MAX_DONATION}
        defaultValue={INITIAL_DONATION}
        onChange={setDonation}
        step={0.1}
      />
      <div className={styles.range}>
        <span>{`${MIN_DONATION} ETH`}</span>
        <span>{`${MAX_DONATION} ETH`}</span>
      </div>
      <span
        className={cn(styles.donationDescription, { [styles.mobileDonationDescription]: isMobile })}
      >
        {`You are donating`}
        <input
          type="number"
          className={styles.input}
          value={parseFloat(donation)}
          onChange={setDonation}
          min={INITIAL_DONATION}
          max={MAX_DONATION}
        />
        ETH
      </span>
    </>
  );
};

export default SelectDonation;
