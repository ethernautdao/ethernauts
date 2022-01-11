import { WalletProvider } from '../contexts/WalletProvider';
import { DonationProvider } from '../contexts/DonationProvider';

import { Layout } from '../components/Layout';

import 'react-medium-image-zoom/dist/styles.css';
import 'rc-slider/assets/index.css';

import '../styles/globals.scss';
import '../styles/fullpage.scss';
import '../styles/theme.scss';

import '../styles/rc-slider.scss';
import '../styles/react-medium-image-zoom.scss';

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
