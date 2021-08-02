import React from 'react';

import Item from './Item';
import classes from './Footer.module.scss';

const data = [
  'total',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
];

export default ({
  timesPanel,
  daysOfWeek,
  withCost,
}) => (
  <div className={classes.footer}>
    {
      data.map((item) => (
        <Item
          key={item}
          employeeCount={timesPanel[item]?.employeeCount}
          empty={(
            (item === 'total' || (daysOfWeek[item - 1]?.checked && !daysOfWeek[item - 1]?.disabled))
              ? !timesPanel[item]?.employeeCount
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
