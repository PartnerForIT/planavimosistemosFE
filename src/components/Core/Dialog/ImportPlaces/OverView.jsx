import React from 'react';
import { useTranslation } from 'react-i18next';
import ImportIcon from '../../../Icons/ImportIcon';
import classes from './ImportPlaces.module.scss';

function OverView() {
  const { t } = useTranslation();

  return (
    <div className={classes.importIconWrapper}>
      <ImportIcon className={classes.icon} />
      <p>{t('Select a CSV file from your computer and upload')}</p>
    </div>
  );
}

export default OverView;
