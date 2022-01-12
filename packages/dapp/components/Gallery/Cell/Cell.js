import cn from 'classnames';
import Image from 'next/image';
import Zoom from 'react-medium-image-zoom';

import UnrevealedDummyImage from './unrevealed-token.png';
import RevealedDummyImage from './revealed-token.png';

import { ALL, ME } from '../Grid';

import styles from './Cell.module.scss';

const MAX_PRIORITY_ITEMS = 24;

const Cell = ({ tokenId, isRevealed, kind, isMiddleCell }) => {
  const hasPriority = tokenId <= MAX_PRIORITY_ITEMS;

  // TODO: Use the URL of the fleek ipfs gateway to display the NFT
  const imageSrc = isRevealed ? RevealedDummyImage : UnrevealedDummyImage;

  return (
    <div
      key={`cell-${tokenId}`}
      className={cn(styles.cellContainer, {
        [styles.middle]: isMiddleCell,
        [styles.all]: kind === ALL,
        [styles.me]: kind === ME,
      })}
    >
      <Zoom>
        <Image
          src={imageSrc}
          className={styles.image}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority={hasPriority}
        />
      </Zoom>
      <span className={styles.tokenId}>#{tokenId}</span>
    </div>
  );
};

export default Cell;
