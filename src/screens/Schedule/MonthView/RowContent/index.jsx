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

  const newFoundItem = (day) => {
    const ev = events.find((item) => resourceId === item.resourceId && item.day_number*1 == day*1);
    if (ev?.old_employee && ev?.new_employee && ev?.empty_employee) {
      return {};
    }
    return ev;
  }

  let time = 0;
  let cost = 0;
  let night_duration = 0;
  const check = (statistic, id, night = false) => {
    if (statistic && id === "totalTime"){
      if (night) {
        return night_duration
      }
      return time
    }
    if (statistic && id === "totalCost" && !night){
      return cost*1
    }

    return ''
  }
  
  return (
    <>
      <div className={classes.rowContent}>
        {
          daysOfMonth.map((item, index) => {
                  if(index < item.id ){
                    time+=newFoundItem(item.title)?.hours ?? 0
                    cost+=newFoundItem(item.title)?.cost ? newFoundItem(item.title)?.cost*1 : 0
                    night_duration+=newFoundItem(item.title)?.night_duration ?? 0
                  }
         return (
             <Cell
                key={item.id}
                title={item.statistic ? check(item.statistic, item.id) : (newFoundItem(item.title)?.hours ?? '')}
                statistic={item.statistic}
                weekend={item.weekend}
                past={!item.statistic && pastDay >= item.id}
                night_duration={item.statistic ? check(item.statistic, item.id, true) : (newFoundItem(item.title)?.night_duration ?? false)}
            />)
          }
          )
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
