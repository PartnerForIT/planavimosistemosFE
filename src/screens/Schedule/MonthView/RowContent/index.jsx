import React, { useMemo, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import Cell from '../Cell';
import classes from './RowContent.module.scss';

const RowContent = ({
  resourceId,
  resources,
  events,
  daysOfMonth,
  expander,
  pastDay,
}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const foundItem = useMemo(() => events.find((item) => resourceId === item.resourceId), [events, resourceId]);

  return (
    <>
      <div className={classes.rowContent}>
        {
          daysOfMonth.map((item) => (
            <Cell
              key={item.id}
              title={item.statistic ? foundItem?.times?.[item.id] : foundItem?.times?.[item.id]?.hours ?? ''}
              statistic={item.statistic}
              weekend={item.weekend}
              past={!item.statistic && pastDay >= item.id}
            />
          ))
        }
      </div>
      {
        expander && resources?.map((item) => (
          <RowContent
            key={item.id}
            events={events}
            resourceId={item.id}
            resources={item.children}
            expander={item.expander}
            daysOfMonth={daysOfMonth}
            pastDay={pastDay}
          />
        ))
      }
    </>
  );
};

export default RowContent;
