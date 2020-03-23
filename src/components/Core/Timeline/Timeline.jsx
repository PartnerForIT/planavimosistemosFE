import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Timeline.module.scss';
import { getColorByStatus, timeToMinutes } from '../../Helpers';

const Timeline = ({ data, total, withTimeBreaks = true }) => {
  const [timespans, setTimespans] = useState([]);

  useEffect(() => {
    const calculateTimespans = () => {
      const arrayCopy = [...data];
      return arrayCopy.map((span) => {
        const totalMinutes = timeToMinutes(total);
        return { ...span, width: `${(timeToMinutes(span.duration) * 100) / totalMinutes}%` };
      });
    };
    setTimespans(calculateTimespans);
  }, [data, total]);

  const Timespan = ({ timespan }) => (
    <div
      className={classNames(styles.timespan)}
      style={{ width: timespan.width, backgroundColor: getColorByStatus(timespan.status) }}
    >
      {
        withTimeBreaks ? (
          <>
            <div className={classNames(styles.time, styles.timeStart)}>{timespan.start}</div>
            <div className={classNames(styles.time, styles.timeEnd)}>{timespan.end}</div>
          </>
        )
          : null
      }
    </div>
  );

  return (
    <div className={styles.timeline}>
      {
        timespans.map((timespan, idx) => (
          <Timespan key={idx.toString()} timespan={timespan} />
        ))
      }
    </div>
  );
};

export default Timeline;
