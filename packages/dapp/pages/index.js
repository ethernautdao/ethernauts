import Head from 'next/head';
import { useMemo } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

import { Hero } from '../components/Hero';
import { AboutUs } from '../components/AboutUs';
import { Mint } from '../components/Mint';
import { Header } from '../components/Header';
import { FairLaunch } from '../components/FairLaunch';
import { Outline } from '../components/Buttons/Outline';

import styles from './index.module.scss';

const sectionsColor = ['#0f1012', '#0f1012'];

export const HomePage = () => {
  const sections = useMemo(
    () => [
      {
        title: <Header />,
        content: ({ fullpageApi }) => (
          <>
            <Hero />
            <Outline text="Mint Now" onClick={() => fullpageApi.moveTo(3, 0)} />
          </>
        ),
      },
      { title: <></>, content: () => <AboutUs /> },
      { title: <></>, content: () => <Mint /> },
      { title: <></>, content: () => <FairLaunch /> },
    ],
    []
  );
 
  return (
    <div className={styles.outerContainer}>
      <Head>
        <title>EthernautDAO - Home</title>
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:title" content="EthernautDAO - Solidifying The Future" />
        <meta property="og:image" content="https://mint.ethernautdao.io/assets/twitter-card.png" />
        <meta property="og:url" content="https://mint.ethernautdao.io/" />
        <meta
          name="twitter:card"
          content="https://mint.ethernautdao.io/assets/main-background.jpg"
        />

        <meta
          property="og:description"
          content="A common goods DAO aimed at transforming developers into Ethereum developers."
        />
        <meta property="og:site_name" content="EthernautDAO - Solidifying The Future" />
        <meta
          name="twitter:image:alt"
          content="A common goods DAO aimed at transforming developers into Ethereum developers."
        />
      </Head>

      <ReactFullpage
        navigation
        anchors={['home', 'about', 'donate', 'fair']}
        menu= '#menu'
        scrollOverflow='true'
        paddingTop='60px'
	      paddingBottom='60px'
        sectionsColor={sectionsColor}
        onLeave={() => {}}
        render={({ fullpageApi }) => (
          <ReactFullpage.Wrapper>
            {sections.map(({ title, content }, index) => (
              <div key={index} className="section">
                {title}
                {content({ fullpageApi })}
              </div>
            ))}
          </ReactFullpage.Wrapper>
        )}
      />
    </div>
  );
};

export default HomePage;
