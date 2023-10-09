import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import HolidayIcon from '../../../../components/Core/HolidayIcon/HolidayIcon';

import classes from './Cell.module.scss';

export default ({
  title,
  startFinish,
  statistic,
  weekend,
  past,
  marker,
  today,
  header,
  holiday,
  night_duration,
  markerActive,
  handleMarker,
  scheduleSettings,
}) => {
  
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};

  const cellClasses = classnames(classes.cell, {
    [classes.cell_statistic]: statistic,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_marker]: marker && !title,
    [classes.cell_marker_active]: markerActive && !header,
    [classes.cell_today]: today,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
    [classes.cell_start_finish]: (scheduleSettings?.start_finish && startFinish),
  });

  const refCell = useRef();
  
  useEffect(() => {
    if (!header && title) {
      if (refCell.current.scrollWidth >= refCell.current.offsetWidth) {
        refCell.current.classList.add(classes.cell_doesNotFit);
        refCell.current.firstChild.style.maxWidth = `${refCell.current.offsetWidth - 4}px`;
      }
    }
  }, [title]);

  if (!header && title) {
    return (
      <div className={cellClasses} ref={refCell}>
        <div className={classes.cell__content} data-title={title}>
          <div
            data-for='title'
            data-tip={`${title} hours`}
            className={classes.cell__content__text}
          >
            {scheduleSettings?.start_finish && startFinish ? startFinish.replace('-', ' ') : title}
            {
              night_duration && night_duration > 0 && !scheduleSettings?.start_finish ? (
                <span className={classes.cell_night}>
                  {night_duration}
                </span>
              ) : ''
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-for='user_marker' data-tip={marker && !title ? marker.comment : ''} className={cellClasses} ref={refCell} onClick={handleMarker}>
      {title != 0 ? title : ''}
      <HolidayIcon
        holidays={holiday}
        month={true}
      />
    </div>
  );
};
