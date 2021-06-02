import React from 'react';
import { useTranslation } from 'react-i18next';

import KioskIcon from '../../Icons/KioskIcon';
import styles from './KioskCard.module.scss';

export default ({
  name,
  photoIn,
  photoOut,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.kioskCard}>
      <div className={styles.kioskCard__header}>
        <KioskIcon />
        {`${t('Kiosk')} - [${name}]`}
      </div>
      {
        photoIn && (
          <>
            <span className={styles.kioskCard__text}>
              {t('Clock In photo')}
            </span>
            <img
              className={styles.kioskCard__image}
              src={photoIn}
              alt='in'
            />
          </>
        )
      }
      {
        photoOut && (
          <>
            <span className={styles.kioskCard__text}>
              {t('Clock Out photo')}
            </span>
            <img
              className={styles.kioskCard__image}
              src={photoIn}
              alt='out'
            />
          </>
        )
      }
    </div>
  );
};
