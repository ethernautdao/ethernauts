import cn from 'classnames';
import { useMemo } from 'react';
import Zoom from 'react-medium-image-zoom';
import useBreakpoint from 'use-breakpoint';

import { BREAKPOINTS } from '../../../constants/common';

import { FLEEK_BUCKET_ID, isDev } from '../../../config';

import { ALL, ME } from '../Grid';

import styles from './Cell.module.scss';

const MAX_PRIORITY_ITEMS = 24;

const Cell = ({ assetId, tokenId, isRevealed, kind, isMiddleCell }) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

  const isMobile = breakpoint === 'mobile';

  const hasPriority = assetId <= MAX_PRIORITY_ITEMS;

  const imageSrc = useMemo(() => {
    if (isRevealed && !isDev)
      return `https://storageapi2.fleek.co/${FLEEK_BUCKET_ID}/assets/${assetId}.png`;

    if (isRevealed && isDev) return '/assets/revealed-token.png';

    if (!isRevealed) return '/assets/unrevealed-token.jpg';
  }, [isRevealed, isDev, assetId]);

  const imageSize = useMemo(() => {
    if (isMobile || kind === ALL) return { width: 'auto', height: '180px' };

    return { width: 'auto', height: '400px' };
  }, [isMobile, kind]);

  return (
    <div
      key={`cell-${tokenId}`}
      className={cn(styles.cellContainer, {
        [styles.middle]: isMiddleCell,
        [styles.all]: kind === ALL,
        [styles.me]: kind === ME,
        [styles.mobile]: isMobile,
      })}
    >
      <Zoom overlayBgColorEnd="rgba(0, 0, 0, 0.95)">
        <img
          src={imageSrc}
          {...imageSize}
          {...imageSize}
          className={styles.image}
          priority={hasPriority.toString()}
        />
      </Zoom>
      <span className={styles.tokenId}>#{tokenId}</span>
    </div>
  );
};

export default Cell;
