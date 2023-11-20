import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import styles from './InfoCard.module.scss';
import LabelWithCurrencySignComa from '../../shared/LabelWithCurrencySignComa';
import PendingIcon from '../../Icons/PendingIcon';
import HolidayGovernmentIcon from '../../Icons/HolidayGovernmentIcon';
import EditIconFixedFill from '../../Icons/EditIconFixedFill';
import {
  getInfoCardColors, timeToMinutes, minutesToString, dateToUCT,
} from '../../Helpers';
import PauseIcon from '../../Icons/PauseIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';
import EarningIcon from '../../Icons/EarningIcon';
import CostIcon from '../../Icons/CostIcon';
import ProfitIcon from '../../Icons/ProfitIcon';

const InfoCard = ({
  type, label, text, icon, time, editable, onChange, durationSec, showRange,
}) => {
  const { t } = useTranslation();
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

    holidayIcon: {
      marginRight: '3px',
    },

    earningIcon: {
      width: '18px',
      marginRight: '3px',
    },

    costIcon: {
      width: '18px',
      marginRight: '3px',
    },

    profitIcon: {
      width: '18px',
      marginRight: '3px',
    }
  });
  const classes = useStyles();

  const CardIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'total':
        return <PendingIcon className={classes.clockIcon} />;
      case 'working':
        return <PendingIcon className={classes.clockIcon} />;
      case 'holiday':
        return <HolidayGovernmentIcon className={classes.holidayIcon} />;
      case 'break':
        return <PauseIcon className={classes.clockIcon} />;
      case 'night':
        return <PendingIcon className={classes.clockIcon} />;
      case 'earning':
        return <EarningIcon className={classes.earningIcon} />;
      case 'cost':
        return <CostIcon className={classes.costIcon} />;
      case 'profit':
        return <ProfitIcon className={classes.profitIcon} />;
      default:
        return null;
    }
  };

  const CardLabel = () => {
    if (label) return label;
    switch (type) {
      case 'total':
        return t('Total hours');
      case 'working':
        return t('Working hours');
      case 'holiday':
        return t('Holiday hours');
      case 'break':
        return t('On break');
      case 'night':
        return t('Night time');
      case 'earning':
        return t('Earnings');
      case 'cost':
        return t('Cost');
      case 'profit':
        return t('Profit');
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
      case 'working':
      case 'holiday':
      case 'break':
      case 'night':
        return (
          <>
            <span className={styles.time}>{parseInt(durationArray[0], 10)}</span>
            <span className={styles.text}>h</span>
            { ' ' }
            <span className={styles.time}>{parseInt(durationArray[1], 10)}</span>
            <span className={styles.text}>min</span>
          </>
        );
      case 'earning':
        return <LabelWithCurrencySignComa label={time.charge} />;
      case 'cost':
        return <LabelWithCurrencySignComa label={time.cost} />;
      case 'profit':
        return <LabelWithCurrencySignComa label={time.profit} />;
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
                  { editable && (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    className={classes.editIcon}
                    onClick={() => setEditing(true)}
                  >
                    <EditIconFixedFill />
                  </div>
                  ) }
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
