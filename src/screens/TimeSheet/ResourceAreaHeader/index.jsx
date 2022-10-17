import React from 'react';

import HolidayIcon from '../../../components/Core/HolidayIcon/HolidayIcon';
import classes from './ResourceAreaHeader.module.scss';

export default ({
  title,
  holiday,
  onClickPrev,
  onClickNext,
}) => (
  <div className={classes.resourceAreaHeader}>
    <button
      className={classes.resourceAreaHeader__buttonLeft}
      aria-label='prev'
      onClick={onClickPrev}
    />
    <span>
      {title}
      <HolidayIcon
        holidays={holiday}
      />
    </span>
    <button
      className={classes.resourceAreaHeader__buttonRight}
      aria-label='next'
      onClick={onClickNext}
    />
  </div>
);
