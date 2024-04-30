import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './PhotoCard.module.scss';

export default ({
  photoIn,
  photoOut,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.photoCard}>
      {
        photoIn && (
          <>
            <span className={styles.photoCard__text}>
              {t('Clock In photo')}
            </span>
            <img
              className={styles.photoCard__image}
              src={photoIn}
              alt='in'
            />
          </>
        )
      }
      {
        photoOut && (
          <>
            <span className={styles.photoCard__text}>
              {t('Clock Out photo')}
            </span>
            <img
              className={styles.photoCard__image}
              src={photoOut}
              alt='out'
            />
          </>
        )
      }
    </div>
  );
};
