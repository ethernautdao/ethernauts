import { createContext, useState } from 'react';

const DonationContext = createContext();

const DonationProvider = ({ children }) => {
  const [donation, setDonation] = useState(0);

  const value = { donation, setDonation };

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
};

export { DonationProvider, DonationContext };
