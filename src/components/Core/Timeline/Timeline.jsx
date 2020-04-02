import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns';
import styles from './Timeline.module.scss';
import { datetimeToMinutes, getColorByStatus } from '../../Helpers';

const Timeline = ({
  data, total, startMinute, withTimeBreaks = true,
}) => {
  const [timespans, setTimespans] = useState([]);

  useEffect(() => {
    const calculateTimespans = () => {
      const arrayCopy = [...data];
      return arrayCopy.map((span) => ({
        ...span,
        width: `${Math.round(((((span.duration * 100) / total) + Number.EPSILON) * 100) / 100)}%`,
        left: `${((datetimeToMinutes(span.started_at) - startMinute) * 100) / total}%`,
      }));
    };
    setTimespans(calculateTimespans);
  }, [data, startMinute, total]);

  const Timespan = ({ timespan }) => (
    <div
      className={classNames(styles.timespan)}
      style={{
        width: timespan.width,
        left: timespan.left,
        backgroundColor: getColorByStatus(timespan.status || 'Approved'),
      }}
    >
      {
        withTimeBreaks && total > 0 ? (
          <>
            <div className={classNames(styles.time, styles.timeStart)}>
              {format(new Date(timespan.started_at), 'HH:mm')}
            </div>
            <div className={classNames(styles.time, styles.timeEnd)}>
              {format(new Date(timespan.finished_at), 'HH:mm')}
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
        timespans.map((timespan, idx) => (
          <Timespan key={idx.toString()} timespan={timespan} />
        ))
      }
    </div>
  );
};

export default Timeline;
