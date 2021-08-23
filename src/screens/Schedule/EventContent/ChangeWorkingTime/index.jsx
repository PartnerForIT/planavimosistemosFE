import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Tooltip from 'react-tooltip';
import { useToggle } from 'react-use';

import classes from './ChangeWorkingTime.module.scss';

export default ({
  photo,
  jobTypeName,
  employeeName,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    Tooltip.rebuild();
  });

  return (
    <div className={classes.changeWorkingTime}>
      <div className={classes.changeWorkingTime__title}>
        {t('Change Working Time')}
      </div>
      <div className={classes.changeWorkingTime__userInfo}>
        {
          photo && (
            <img
              className={classes.changeWorkingTime__userInfo__avatar}
              alt='avatar'
              src={photo}
            />
          )
        }
        {`${employeeName} • ${jobTypeName}`}
      </div>
      <div className={classes.changeWorkingTime__form}>

      </div>
    </div>
  );
};
