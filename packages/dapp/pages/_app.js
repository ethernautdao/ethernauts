import { WalletProvider } from '../contexts/WalletProvider';
import { DonationProvider } from '../contexts/DonationProvider';

import { Layout } from '../components/Layout';

import '../styles/globals.scss';
import 'rc-slider/assets/index.css';

const MyApp = ({ Component, pageProps }) => {
  return (
    <WalletProvider>
      <DonationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DonationProvider>
    </WalletProvider>
  );
};

export default MyApp;
