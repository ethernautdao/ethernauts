import { useMemo } from 'react';
import cn from 'classnames';
import chunk from 'lodash.chunk';

import { Cell } from '../Cell';

import { ALL, ME } from './kind';
import styles from './Grid.module.scss';

const ALL_DESKTOP_COLUMNS = 3;
const ALL_MOBILE_COLUMNS = 1;

const Grid = ({ items, kind }) => {
  // TODO: Check screen size and set isDesktop with the correct value
  const isDesktop = true;

  const columns = isDesktop ? ALL_DESKTOP_COLUMNS : ALL_MOBILE_COLUMNS;

  const chunks = useMemo(() => chunk(items, columns), [items, columns]);

  const isMiddleCell = (tokenId) => {
    if (kind === ME) return false;

    return chunks.some((item) => {
      return item[1]?.tokenId === tokenId;
    });
  };

  return (
    <div className={styles.outerContainer}>
      <div className={cn(styles.grid, { [styles.all]: kind === ALL, [styles.me]: kind === ME })}>
        {items?.map(({ tokenId, isRevealed }) => {
          const isMiddle = isMiddleCell(tokenId);
          return (
            <Cell
              key={tokenId}
              tokenId={tokenId}
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
