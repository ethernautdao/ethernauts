import { createContext, useState } from 'react';

import { INITIAL_DONATION } from '../../constants';

const DonationContext = createContext();

const DonationProvider = ({ children }) => {
  const [donation, setDonation] = useState(INITIAL_DONATION);

  const value = { donation, setDonation };

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
};

export { DonationProvider, DonationContext };
