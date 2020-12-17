import React from 'react';
import { useTranslation } from 'react-i18next';
import classes from '../Roles.module.scss';
import Tooltip from '../../../../Core/Tooltip';

function Content({ children, title = '', tooltip = '' }) {
  const { t } = useTranslation();
  return (
    <div className={classes.details_inner}>
      <div className={classes.details_inner_title}>
        <p>
          {t(title)}
          {' '}
          <span><Tooltip title={t(tooltip)} /></span>
        </p>
        <div className={classes.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Content;
