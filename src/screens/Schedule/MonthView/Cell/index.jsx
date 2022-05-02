import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';

import classes from './Cell.module.scss';

export default ({
  title,
  statistic,
  weekend,
  past,
  today,
  header,
}) => {
  const cellClasses = classnames(classes.cell, {
    [classes.cell_statistic]: statistic,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_today]: today,
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
            {title}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cellClasses} ref={refCell}>
      {title}
    </div>
  );
};
