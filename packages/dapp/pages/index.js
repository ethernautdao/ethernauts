import Head from 'next/head';
import { useMemo } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

import { Hero } from '../components/Hero';
import { Mint } from '../components/Mint';
import { Header } from '../components/Header';
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
            <Outline text="Mint Now" onClick={() => fullpageApi.moveSectionDown()} />
          </>
        ),
      },
      { title: <></>, content: () => <Mint /> },
    ],
    []
  );

  return (
    <div className={styles.outerContainer}>
      <Head>
        <title>EthernautDAO - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ReactFullpage
        navigation
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
