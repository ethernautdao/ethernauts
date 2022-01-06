import Head from 'next/head';
import { useMemo } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';

import { Outline } from '../components/Buttons/Outline';
import { Hero } from '../components/Hero';
import { Mint } from '../components/Mint';
import { Header } from '../components/Header';

import styles from './index.module.scss';

const sectionsColor = ['#000000', '#000000'];

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
        <title>EthernautDAO</title>
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
