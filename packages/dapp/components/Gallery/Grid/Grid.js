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

    return chunks.some((item) => item[1].args.tokenId.toString() === tokenId);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={cn(styles.grid, { [styles.all]: kind === ALL, [styles.me]: kind === ME })}>
        {items?.map((item) => {
          const isMiddle = isMiddleCell(item.args.tokenId.toString());
          return (
            <Cell
              key={item.args.tokenId.toString()}
              kind={kind}
              item={item}
              isMiddleCell={isMiddle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Grid;
