import { useContext } from 'react';
import Slider from 'rc-slider';

import { INITIAL_DONATION, MAX_DONATION } from '../../constants';

import { DonationContext } from '../../contexts/DonationProvider';

import styles from './DonationSlide.module.scss';

const SelectDonation = () => {
  const { donation, setDonation } = useContext(DonationContext);

  return (
    <>
      <Slider
        min={INITIAL_DONATION - 1}
        max={MAX_DONATION}
        defaultValue={INITIAL_DONATION}
        onChange={setDonation}
        step={0.1}
      />
      <span className={styles.donationDescription}>
        {`You are donating `}
        <input
          type="number"
          className={styles.input}
          value={donation}
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
