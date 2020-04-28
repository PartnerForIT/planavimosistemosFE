import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Timeline.module.scss';
import { datetimeToSeconds } from '../../Helpers';
import Timespan from './Timespan';

const Timeline = ({
  works, breaks, total, startMinute, withTimeBreaks = true, startTime, endTime,
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

  return (
    <div className={classNames(styles.timelineWrap, { [styles.timelineWrapWithBreaks]: withTimeBreaks && total > 0 })}>
      <div className={classNames(styles.timeline, { [styles.timelineWithTimeBreaks]: withTimeBreaks && total > 0 })}>
        <div className={styles.startTime}>{startTime}</div>
        <div className={styles.endTime}>{endTime}</div>
        <div className={styles.worktimes}>
          {
            workTimespans.map((timespan, idx) => (
              <Timespan
                key={idx.toString()}
                timespan={timespan}
                type='work'
                withTimeBreaks={withTimeBreaks}
                total={total}
              />
            ))
          }
        </div>
        <div className={styles.breaktimes}>
          {
            breakTimespans.map((timespan, idx) => (
              <Timespan
                key={idx.toString()}
                timespan={timespan}
                type='break'
                withTimeBreaks={withTimeBreaks}
                total={total}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Timeline;
