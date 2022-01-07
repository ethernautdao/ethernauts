import cn from 'classnames';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';

import DummyImage from './dummy-cell-image.png';

import styles from './Cell.module.scss';
import { ALL, ME } from '../Grid';

const MAX_PRIORITY_ITEMS = 20;

const Cell = ({ item, kind, isMiddleCell }) => {
  const hasPriority = Number(item.args.tokenId.toString()) <= MAX_PRIORITY_ITEMS;

  return (
    <div
      key={`cell-${item.args.tokenId.toString()}`}
      className={cn(styles.cellContainer, {
        [styles.middle]: isMiddleCell,
        [styles.all]: kind === ALL,
        [styles.me]: kind === ME,
      })}
    >
      <Zoom>
        <Image
          // TODO: Use the URL of the fleek ipfs gateway to display the NFT
          src={DummyImage}
          className={styles.image}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority={hasPriority}
        />
      </Zoom>
      <span className={styles.tokenId}>#{item.args.tokenId.toString()}</span>
    </div>
  );
};

export default Cell;
