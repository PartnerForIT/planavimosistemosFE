import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './Timeline.module.scss';
import { dateToUCT, getColorByStatus } from '../../Helpers';

const Timespan = ({
  timespan, type,
}) => {
  const [selected, setSelected] = useState(false);

  const timespanClasses = classNames(
    styles.timespan,
    { [styles.workTime]: type === 'work', [styles.breakTime]: type === 'break', [styles.nightTime]: type === 'night', [styles.selected]: selected },
  );

  return (
    <ClickAwayListener onClickAway={() => setSelected(false)}>
      <Tooltip
        disableFocusListener
        title={`${format(dateToUCT(timespan.started_at), 'HH:mm')} - 
               ${format(dateToUCT(timespan.finished_at), 'HH:mm')}`}
      >
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className={timespanClasses}
          style={{
            width: timespan.width,
            left: timespan.left,
            backgroundColor: getColorByStatus(type || 'break'),
          }}
          onClick={() => setSelected(!selected)}
        >
          {/* { */}
          {/*  withTimeBreaks && total > 0 ? ( */}
          {/*    <div className={styles.tooltip}> */}
          {/*      {`${format(dateToUCT(timespan.started_at), 'HH:mm')} - */}
          {/*      ${format(dateToUCT(timespan.finished_at), 'HH:mm')}`} */}
          {/*    </div> */}
          {/*  ) */}
          {/*    : null */}
          {/* } */}
        </div>
      </Tooltip>
    </ClickAwayListener>
  );
};

export default Timespan;
