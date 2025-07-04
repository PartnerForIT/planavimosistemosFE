import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import HolidayIcon from '../../../../components/Core/HolidayIcon/HolidayIcon';

import classes from './Cell.module.scss';

const Cell = ({
  cellId,
  title,
  statistic,
  article,
  weekend,
  past,
  today,
  header,
  holiday,
  night_duration,
  tooltip,
}) => {
  
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};

  const cellClasses = classnames(classes.cell, {
    [classes.cell_statistic_time]: cellId === 'totalTime',
    [classes.cell_statistic_cost]: cellId === 'totalCost',
    [classes.cell_statistic_planned]: cellId === 'plannedTime' || cellId === 'plannedTimeMonth',
    [classes.cell_statistic_target]: cellId === 'targetTime' || cellId === 'targetTimeMonth',
    [classes.cell_statistic]: statistic,
    [classes.cell_article]: article,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_today]: today,
    [classes.cell_header]: header,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
  });

  const refCell = useRef();

  useEffect(() => {
    if (!header && title) {
      if (refCell.current.scrollWidth >= refCell.current.offsetWidth || tooltip) {
        refCell.current.classList.add(classes.cell_doesNotFit);
        refCell.current.firstChild.style.maxWidth = `${refCell.current.offsetWidth - 4}px`;
      }
    }
    // eslint-disable-next-line
  }, [title]);

  if (!header && title) {
    return (
      <div className={cellClasses} ref={refCell}>
        <div className={classes.cell__content} data-title={tooltip ? tooltip : title}>
          <div
            data-tooltip-id='title'
            data-tooltip-html={`${tooltip ? tooltip : title}`}
            className={classes.cell__content__text}
          >
            {title}
            {
              night_duration && night_duration > 0 ? (
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
    <div className={cellClasses} ref={refCell}>
      <div
        data-tooltip-id='title'
        data-tooltip-html={`${tooltip ? tooltip : ''}`}
      >
        {title !== 0 ? title : ''}
      </div>
      
      { header && (
        <HolidayIcon
          holidays={holiday}
          month={true}
        />
      )}
    </div>
  );
};

export default Cell
