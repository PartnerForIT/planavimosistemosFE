import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './DefaultShiftTime.module.scss';

export default () => {
  const { t } = useTranslation();

  return (
    <div className={classes.defaultShiftTime}>
      {t('Default Shift Time')}
    </div>
  );
};
