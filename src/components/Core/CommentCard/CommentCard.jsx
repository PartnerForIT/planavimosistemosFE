import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import CommentIcon from '../../Icons/CommentIcon';
import styles from './CommentCard.module.scss';

import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'

export default function CommentCard({
  onEditComment,
  photo,
  comment,
  width: propWidth,
  height: propHeight
}) {
  const { t } = useTranslation();
  const [dimensions, setDimensions] = useState({ width: propWidth, height: propHeight });

  useEffect(() => {
    if (!propWidth || !propHeight) {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
      };
    }
  }, [photo, propWidth, propHeight]);

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentCard__header}>
        <CommentIcon />
        {t('Comment')}
      </div>
      {
        photo && (
          <Gallery withDownloadButton>
            <Item
              original={photo}
              thumbnail={photo}
              width={dimensions.width}
              height={dimensions.height}
              target="_blank"
            >
              {({ ref, open }) => (
                <img className={styles.commentCard__image} ref={ref} onClick={open} src={photo} alt='comment' />
              )}
            </Item>
          </Gallery>
        )
      }
      <span
        onClick={onEditComment}
        className={styles.commentCard__text}>
        {comment || ''}
      </span>
    </div>
  );
}