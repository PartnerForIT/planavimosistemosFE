import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import styles from './InfoCard.module.scss';
import PendingIcon from '../../Icons/PendingIcon';
import EditIconFixedFill from '../../Icons/EditIconFixedFill';
import {
  getInfoCardColors, timeToMinutes, minutesToString, dateToUCT,
} from '../../Helpers';
import PauseIcon from '../../Icons/PauseIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';

const InfoCard = ({
  type, label, text, icon, time, editable, onChange, durationSec, showRange,
}) => {
  const [start, setStart] = useState(time && time.started_at
    ? format(dateToUCT(time.started_at), 'HH:mm') : '00:00');
  const [end, setEnd] = useState(time && time.finished_at
    ? format(dateToUCT(time.finished_at), 'HH:mm') : '00:00');
  const [editing, setEditing] = useState(false);

  const colors = getInfoCardColors(type);

  const useStyles = makeStyles({
    clockIcon: {
      width: '18px',
      paddingRight: '2px',

      '& g': {
        fill: '#fff !important',
        stroke: colors.background,
      },

      '& path': {
        fill: `${colors.text} !important`,
      },
    },

    editIcon: {
      backgroundColor: 'rgba(230, 238, 245, 0.55)',
      borderRadius: '5px',
      padding: '2px',
      marginLeft: '5px',
      cursor: 'pointer',

      '& svg': {
        width: '20px',
        height: '18px',
        paddingLeft: '1px',

        '& path': {
          fill: `${colors.text} !important`,
        },
      },
    },

    approvedIcon: {
      '& g': {
        stroke: colors.background,

        '& circle': {
          stroke: colors.background,
        },
      },
    },
  });
  const classes = useStyles();

  const CardIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'total':
        return <PendingIcon className={classes.clockIcon} />;
      case 'break':
        return <PauseIcon className={classes.clockIcon} />;
      default:
        return null;
    }
  };

  const CardLabel = () => {
    if (label) return label;
    switch (type) {
      case 'total':
        return 'Total hours';
      case 'break':
        return 'On break';
      default:
        return null;
    }
  };

  const CardText = () => {
    if (!time || !time.duration) return <span className={styles.time}>{text}</span>;

    const durationArray = typeof durationSec !== 'undefined'
      ? minutesToString(Math.floor(durationSec / 60)).split(':')
      : time.duration.split(':');

    switch (type) {
      case 'total':
      case 'break':
        return (
          <>
            <span className={styles.time}>{parseInt(durationArray[0], 10)}</span>
            <span className={styles.text}>h</span>
            { ' ' }
            <span className={styles.time}>{parseInt(durationArray[1], 10)}</span>
            <span className={styles.text}>min</span>
          </>
        );
      case 'cost':
        return <PauseIcon className={classes.clockIcon} />;
      default:
        return <span className={styles.time}>{text}</span>;
    }
  };

  const approveChanges = () => {
    const duration = minutesToString(timeToMinutes(end) - timeToMinutes(start));
    onChange({
      ...time, start, end, duration,
    });
    setEditing(false);
  };

  const declineChanges = () => {
    setEditing(false);
    setStart(format(dateToUCT(time.started_at), 'HH:mm'));
    setEnd(format(dateToUCT(time.finished_at), 'HH:mm'));
  };

  return (
    <div
      className={styles.infoCard}
      style={{ backgroundColor: colors.background }}
    >
      <div className={styles.headerRow}>
        <div className={styles.leftSide} style={{ color: colors.text }}>
          <CardIcon />
          <CardLabel />
        </div>
        { time && (
        <div className={styles.rightSide}>
          {
            editing
              ? (
                <>
                  <div className={styles.editableBlock}>
                    <input
                      type='text'
                      className={styles.editableInput}
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                    />
                    -
                    <input
                      type='text'
                      className={styles.editableInput}
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                    />
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div onClick={approveChanges} className={styles.actionsIcon}>
                    <ApprovedIcon className={classes.approvedIcon} />
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div onClick={declineChanges} className={styles.actionsIcon}>
                    <SuspendedIcon className={classes.approvedIcon} />
                  </div>
                </>
              )
              : showRange && (
                <>
                  {`${start} - ${end}`}
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  { editable && <div className={classes.editIcon} onClick={() => setEditing(true)}><EditIconFixedFill /></div> }
                </>
              )
          }

        </div>
        )}
      </div>
      <div className={styles.timeBlock}>
        <CardText />
      </div>
    </div>
  );
};
export default InfoCard;
