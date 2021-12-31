import { useContext, useEffect } from 'react';
import Slider from 'rc-slider';

import useSaleState from '../../hooks/useSaleState';

import { INITIAL_DONATION, MIN_DONATION, MAX_DONATION, EARLY } from '../../constants';

import { WalletContext } from '../../contexts/WalletProvider';
import { DonationContext } from '../../contexts/DonationProvider';

import styles from './DonationSlide.module.scss';

const SelectDonation = () => {
  const { state } = useContext(WalletContext);
  const { donation, setDonation } = useContext(DonationContext);
  const [{ data, isLoading, isError }, fetchSaleState] = useSaleState();

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
        <span>0.2 ETH</span>
        <span>14 ETH</span>
      </div>
      <span className={styles.donationDescription}>
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
