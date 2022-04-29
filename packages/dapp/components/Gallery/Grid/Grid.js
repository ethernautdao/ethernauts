import cn from 'classnames';
import { useMemo } from 'react';
import chunk from 'lodash.chunk';
import useBreakpoint from 'use-breakpoint';

import { BREAKPOINTS } from '../../../constants/common';

import { Cell } from '../Cell';

import { ALL, ME } from './kind';
import styles from './Grid.module.scss';

const ALL_DESKTOP_COLUMNS = 3;
const ALL_MOBILE_COLUMNS = 1;

const Grid = ({ items, kind }) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

  const isMobile = breakpoint === 'mobile';

  const columns = isMobile ? ALL_MOBILE_COLUMNS : ALL_DESKTOP_COLUMNS;

  const chunks = useMemo(() => chunk(items, columns), [items, columns]);

  const isMiddleCell = (tokenId) => {
    if (kind === ME) return false;

    return chunks.some((item) => {
      return item[1]?.tokenId === tokenId;
    });
  };

  return (
    <div className={styles.outerContainer}>
      <div
        className={cn(styles.grid, {
          [styles.all]: kind === ALL,
          [styles.me]: kind === ME,
          [styles.mobileGrid]: isMobile,
        })}
      >
        {items?.map(({ assetId, tokenId, isRevealed }) => {
          const isMiddle = isMiddleCell(tokenId);
          return (
            <Cell
              key={tokenId}
              tokenId={tokenId}
              assetId={assetId}
              isRevealed={isRevealed}
              kind={kind}
              isMiddleCell={isMiddle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
