import { WalletProvider } from '../contexts/WalletProvider';
import { Layout } from '../components/Layout';

import '../styles/globals.scss';

const MyApp = ({ Component, pageProps }) => {
  return (
    <WalletProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletProvider>
  );
};

export default MyApp;
