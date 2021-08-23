import React from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../Dropdown';

import classes from './ResourceItem.module.scss';

export default ({
  title,
  photo,
  withMenu,
  onEditShift,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {title}
      {
        photo && (
          <img
            alt=''
            // className={styles.cellNameWithAvatar__image}
            src={photo}
          />
        )
      }
      {
        withMenu && (
          <Dropdown>
            <div className={classes.resourceItem__title}>
              {title}
            </div>
            <Dropdown.ItemMenu
              title={t('Edit Shift')}
              onClick={onEditShift}
            />
            <Dropdown.ItemMenu
              title={t('Delete Shift')}
              remove
            />
            <div className={classes.resourceItem__space} />
          </Dropdown>
        )
      }
    </>
  );
};
