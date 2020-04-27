import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styles from './Timeline.module.scss';
import { dateToUCT, getColorByStatus } from '../../Helpers';

const Timespan = ({
  timespan, type, withTimeBreaks, total,
}) => {
  const [selected, setSelected] = useState(false);

  const timespanClasses = classNames(
    styles.timespan,
    { [styles.workTime]: type === 'work', [styles.breakTime]: type === 'break', [styles.selected]: selected },
  );

  return (
    <ClickAwayListener onClickAway={() => setSelected(false)}>
      <div
        className={timespanClasses}
        style={{
          width: timespan.width,
          left: timespan.left,
          backgroundColor: getColorByStatus(type || 'break'),
        }}
        onClick={() => setSelected(!selected)}
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
    </ClickAwayListener>
  );
};

export default Timespan;
