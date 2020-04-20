import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns';
import styles from './Timeline.module.scss';
import { datetimeToSeconds, dateToUCT, getColorByStatus } from '../../Helpers';

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
        backgroundColor: getColorByStatus(type || 'break'),
      }}
    >
      {
        withTimeBreaks && total > 0 ? (
          <>
            <div className={classNames(styles.time, styles.timeStart)}>
              {format(dateToUCT(timespan.started_at), 'HH:mm')}
            </div>
            <div className={classNames(styles.time, styles.timeEnd)}>
              {format(dateToUCT(timespan.finished_at), 'HH:mm')}
            </div>
          </>
        )
          : null
      }
    </div>
  );

  return (
    <div className={classNames(styles.timelineWrap, { [styles.timelineWrapWithBreaks]: withTimeBreaks && total > 0 })}>
      <div className={classNames(styles.timeline, { [styles.timelineWithTimeBreaks]: withTimeBreaks && total > 0 })}>
        <div className={styles.worktimes}>
          {
            workTimespans.map((timespan, idx) => (
              <Timespan key={idx.toString()} timespan={timespan} type='work' />
            ))
          }
        </div>
        {
          breakTimespans.map((timespan, idx) => (
            <Timespan key={idx.toString()} timespan={timespan} type='break' />
          ))
        }
      </div>
    </div>
  );
};

export default Timeline;
