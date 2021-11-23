import React from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../Dropdown';

import classes from './ResourceItem.module.scss';

export default ({
  title,
  photo,
  withMenu,
  onEditShift,
  onDeleteShift,
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
          <Dropdown buttonClass={classes.resourceItem__buttonDots}>
            <div className={classes.resourceItem__title}>
              {title}
            </div>
            <Dropdown.ItemMenu
              title={t('Edit Shift')}
              onClick={onEditShift}
            />
            <Dropdown.ItemMenu
              title={t('Delete Shift')}
              onClick={onDeleteShift}
              remove
            />
            <div className={classes.resourceItem__space} />
          </Dropdown>
        )
      }
    </>
  );
};
