import React from 'react';
import { useTranslation } from 'react-i18next';

import CommentIcon from '../../Icons/CommentIcon';
import styles from './CommentCard.module.scss';

import 'photoswipe/dist/photoswipe.css'
import { Gallery, Item } from 'react-photoswipe-gallery'

export default function CommentCard({
  photo,
  comment,
  width,
  height
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.commentCard}>
      <div className={styles.commentCard__header}>
        <CommentIcon />
        {t('Comment')}
      </div>
      {
        photo && (
          <Gallery
            withDownloadButton
          >
            <Item
              original={photo}
              thumbnail={photo}
              width={width}
              height={height}
              target="_blank"
            >
              {({ ref, open }) => (
                <img className={styles.commentCard__image} ref={ref} onClick={open} src={photo} alt='comment' />
              )}
            </Item>
          </Gallery>
        )
      }
      {
        comment && (
          <span className={styles.commentCard__text}>
            {comment}
          </span>
        )
      }
    </div>
  );
}
