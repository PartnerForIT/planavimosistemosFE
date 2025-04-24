import React, { useMemo } from 'react';
import classNames from 'classnames';
import styles from './Timeline.module.scss';
import { datetimeToSeconds } from '../../Helpers';
import Timespan from './Timespan';

const Timeline = ({
  works = [], breaks = [], night = [], empty = [], total, startMinute, withTimeBreaks = true, startTime, endTime,
}) => {
  const calculateTimespans = useMemo(() => (arr) => {
    return arr.map((span) => ({
      ...span,
      width: `${Math.ceil(((((span.duration_sec * 100) / total) + Number.EPSILON) * 100) / 100)}%`,
      left: `${((datetimeToSeconds(span.started_at) - datetimeToSeconds(startMinute)) * 100) / total}%`,
    }));
  }, [startMinute, total]);

  const workTimespans = useMemo(() => calculateTimespans(works), [works, calculateTimespans]);
  const breakTimespans = useMemo(() => calculateTimespans(breaks), [breaks, calculateTimespans]);
  const nightTimespans = useMemo(() => calculateTimespans(night), [night, calculateTimespans]);
  const emptyTimespans = useMemo(() => calculateTimespans(empty), [empty, calculateTimespans]);

  return (
    <div className={classNames(styles.timelineWrap, { [styles.timelineWrapWithBreaks]: withTimeBreaks && total > 0 })}>
      <div className={classNames(styles.timeline, { [styles.timelineWithTimeBreaks]: withTimeBreaks && total > 0 })}>
        <div className={styles.startTime}>{startTime}</div>
        <div className={styles.endTime}>{endTime}</div>

        <div className={styles.line}>
          <div className={styles.worktimes}>
            {workTimespans.map((timespan, idx) => (
              <Timespan
                key={idx.toString()}
                timespan={timespan}
                type="work"
                withTimeBreaks={withTimeBreaks}
                total={total}
              />
            ))}
          </div>

          <div className={styles.nighttimes}>
            {nightTimespans.map((timespan, idx) => (
              <Timespan
                key={idx.toString()}
                timespan={timespan}
                type="night"
                withTimeBreaks={withTimeBreaks}
                total={total}
              />
            ))}
          </div>

          <div className={styles.breaktimes}>
            {breakTimespans.map((timespan, idx) => (
              <Timespan
                key={idx.toString()}
                timespan={timespan}
                type="break"
                withTimeBreaks={withTimeBreaks}
                total={total}
              />
            ))}
          </div>

          <div className={styles.emptytimes}>
            {emptyTimespans.map((timespan, idx) => (
              <Timespan
                key={idx.toString()}
                timespan={timespan}
                type="empty"
                withTimeBreaks={withTimeBreaks}
                total={total}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;