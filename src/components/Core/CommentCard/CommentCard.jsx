import React from 'react';
import { useTranslation } from 'react-i18next';

import CommentIcon from '../../Icons/CommentIcon';
import styles from './CommentCard.module.scss';

export default function CommentCard({
  photo,
  comment,
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
          <img
            className={styles.commentCard__image}
            src={photo}
            alt='comment'
          />
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
