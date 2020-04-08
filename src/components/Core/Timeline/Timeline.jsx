import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns';
import styles from './Timeline.module.scss';
import { datetimeToSeconds, getColorByStatus } from '../../Helpers';

const Timeline = ({
  works, breaks, total, startMinute, withTimeBreaks = true,
}) => {
  const [workTimespans, setWorkTimespans] = useState([]);
  const [breakTimespans, setBreakTimespans] = useState([]);

  const calculateTimespans = (arr) => {
    const arrayCopy = [...arr];
    return arrayCopy.map((span) => ({
      ...span,
      width: `${Math.ceil(((((span.duration_sec * 100) / total) + Number.EPSILON) * 100) / 100)}%`,
      left: `${((datetimeToSeconds(span.started_at) - datetimeToSeconds(startMinute)) * 100) / total}%`,
    }));
  };

  useEffect(() => {
    setWorkTimespans(calculateTimespans(works));
    setBreakTimespans(calculateTimespans(breaks));
  }, [works, breaks, startMinute, total]);

  const Timespan = ({ timespan, type }) => (
    <div
      className={classNames(styles.timespan,
        { [styles.workTime]: type === 'work', [styles.breakTime]: type === 'break' })}
      style={{
        width: timespan.width,
        left: timespan.left,
        backgroundColor: getColorByStatus(type || ''),
      }}
    >
      {
        withTimeBreaks && total > 0 ? (
          <>
            <div className={classNames(styles.time, styles.timeStart)}>
              {format(new Date(timespan.started_at.replace(' ', 'T')), 'HH:mm')}
            </div>
            <div className={classNames(styles.time, styles.timeEnd)}>
              {format(new Date(timespan.finished_at.replace(' ', 'T')), 'HH:mm')}
            </div>
          </>
        )
          : null
      }
    </div>
  );

  return (
    <div className={classNames(styles.timeline, { [styles.timelineWithTimeBreaks]: withTimeBreaks && total > 0 })}>
      {
        workTimespans.map((timespan, idx) => (
          <Timespan key={idx.toString()} timespan={timespan} type='work' />
        ))
      }
      {
        breakTimespans.map((timespan, idx) => (
          <Timespan key={idx.toString()} timespan={timespan} type='break' />
        ))
      }
    </div>
  );
};

export default Timeline;
