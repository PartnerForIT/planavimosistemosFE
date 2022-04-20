import React from 'react';

import { TIMES_PANEL } from '../../../../../const';

import Item from '../../../DayTotal';
import classes from './Footer.module.scss';

export default ({
  timesPanel,
  daysOfWeek,
  withCost,
}) => {
  return (
    <div className={classes.footer}>
      {
        TIMES_PANEL.map((item) => (
          <Item
            key={item}
            employeesCount={timesPanel[item]?.employeesCount}
            empty={(
              (item === 'total' || (daysOfWeek[item - 1]?.checked && !daysOfWeek[item - 1]?.disabled))
                ? !timesPanel[item]?.employeesCount
                : true
            )}
            photos={timesPanel[item]?.photos}
            hours={timesPanel[item]?.time}
            money={timesPanel[item]?.cost}
            title={timesPanel[item]?.title}
            nested={timesPanel[item]?.children}
            withCost={withCost}
          />
        ))
      }
    </div>
  );
}
