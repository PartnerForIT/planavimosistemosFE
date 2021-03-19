import React, { useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import UserIcon from '../../Icons/UserIcon';
import WarningIcon from '../../Icons/WarningIcon';
import DailyOvertime from '../../Icons/DailyOvertime';
import WeeklyOvertime from '../../Icons/WeeklyOvertime';
import EarlyClockIn from '../../Icons/EarlyClockIn';
import EarlyClockOut from '../../Icons/EarlyClockOut';
import LateClockIn from '../../Icons/LateClockIn';
import LateClockOut from '../../Icons/LateClockOut';
import MissedClockIn from '../../Icons/MissedClockIn';
import MissedClockOut from '../../Icons/MissedClockOut';
import { EVENT_TYPE } from '../../../const';
import classes from './EventCard.module.scss';

// const selectedItem = {
//   works: [
//     {
//       // duration: 599,
//       // duration_sec: 35940,
//       finished_at: "2021-01-29 15:55:58",
//       id: 11,
//       // job_type_id: 2,
//       // place_id: 1,
//       started_at: "2021-01-29 05:56:58",
//     },
//     {
//       // duration: 599,
//       // duration_sec: 35940,
//       finished_at: "2021-01-29 15:55:58",
//       id: 12,
//       // job_type_id: 2,
//       // place_id: 1,
//       started_at: "2021-01-29 16:55:58",
//     },
//   ],
//   breaks: [
//     {
//       // duration: 60,
//       // duration_sec: 3600,
//       finished_at: "2021-01-29 16:55:58",
//       id: 8,
//       // job_type_id: 2,
//       // place_id: 1,
//       started_at: "2021-01-29 15:55:58",
//     },
//     {
//       // duration: 60,
//       // duration_sec: 3600,
//       finished_at: "2021-01-29 15:55:58",
//       id: 9,
//       // job_type_id: 2,
//       // place_id: 1,
//       started_at: "2021-01-29 17:55:58",
//     },
//   ],
// };

const EventInformation = ({
  t,
  type,
  time,
  stopped,
}) => {
  const { items, isOvertime } = useMemo(() => {
    const getTimeString = (seconds) => {
      const duration = moment.duration(seconds, 'seconds');
      return `${duration.get('hours') ? `${duration.get('hours')} ${t('hours')}` : ''}
       ${duration.get('minutes') ? `${duration.get('minutes')} ${t('min')}` : ''}`;
    };
    switch (type) {
      case EVENT_TYPE.EARLY_CLOCK_IN: {
        return {
          items: [
            {
              label: t('Actual clock in time'),
              value: time[0],
            },
            {
              label: t('Work starts'),
              value: time[1],
            },
            {
              label: t('Early clock in time'),
              value: getTimeString(time[2]),
            },
          ],
        };
      }
      case EVENT_TYPE.LATE_CLOCK_IN: {
        return {
          items: [
            {
              label: t('Work starts'),
              value: time[0],
            },
            {
              label: t('Actual clock in time'),
              value: time[1],
            },
            {
              label: t('Late for'),
              value: getTimeString(time[2]),
            },
          ],
        };
      }
      case EVENT_TYPE.MISSING_CLOCK_IN: {
        return {
          items: [
            {
              label: t('Work starts'),
              value: time[0],
            },
            {
              label: t('No clock in for'),
              value: getTimeString(time[1]),
            },
          ],
        };
      }
      case EVENT_TYPE.EARLY_CLOCK_OUT: {
        return {
          items: [
            {
              label: t('Actual clock out'),
              value: time[0],
            },
            {
              label: t('Work ends'),
              value: time[1],
            },
            {
              label: t('Early clock out by'),
              value: getTimeString(time[2]),
            },
          ],
        };
      }
      case EVENT_TYPE.LATE_CLOCK_OUT: {
        return {
          items: [
            {
              label: t('Work ends'),
              value: time[0],
            },
            {
              label: t('Actual clock out'),
              value: time[1],
            },
            {
              label: t('Late clock out by'),
              value: getTimeString(time[2]),
            },
          ],
        };
      }
      case EVENT_TYPE.MISSING_CLOCK_OUT: {
        return {
          items: [
            {
              label: t('Work ends'),
              value: time[0],
            },
            {
              label: t('No clock out for'),
              value: getTimeString(time[1]),
            },
          ],
        };
      }
      case EVENT_TYPE.DAILY_OVERTIME_START: {
        return {
          isOvertime: true,
          items: [
            {
              label: t('Daily overtime rule'),
              value: getTimeString(time[0]),
            },
            {
              label: t('Worked today'),
              value: time[1],
              range: true,
            },
            ...(stopped ? [
              {
                label: t('Work status'),
                value: 'Stopped',
              },
            ] : [
              {
                label: t('Total overtime worked'),
                value: time[2],
                range: true,
              },
              {
                label: t('Overtime time'),
                value: getTimeString(time[3]),
              },
            ]),
          ],
        };
      }
      case EVENT_TYPE.WEEKLY_OVERTIME_START: {
        return {
          isOvertime: true,
          items: [
            {
              label: t('Weekly overtime rule'),
              value: getTimeString(time[0]),
            },
            {
              label: t('Worked this week'),
              value: time[1],
              range: true,
            },
            ...(stopped ? [
              {
                label: t('Work status'),
                value: 'Stopped',
              },
            ] : [
              {
                label: t('Total overtime worked'),
                value: time[2],
                range: true,
              },
              {
                label: t('Overtime time'),
                value: getTimeString(time[3]),
              },
            ]),
          ],
        };
      }
      default: return { items: [] };
    }
  }, [type, time, stopped]);

  return (
    <div className={classes.eventInformation}>
      <div className={classes.eventInformation__header}>
        <WarningIcon />
        {t('Event Information')}
      </div>
      <div
        className={`${classes.eventInformation__progressType}
         ${isOvertime ? classes.eventInformation__progressType_overtime : ''}`}
      >
        {
          items.map((item) => (
            <div
              className={`${classes.eventInformation__progressType__item}
                ${item.range ? classes.eventInformation__progressType__item_range : ''}`}
            >
              {item.label}
              <span className={classes.eventInformation__progressType__item__value}>
                {item.value}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
};

const mockSelectedItem = {
  total: {
    week: 0,
    month: 1,
    total: 1,
  },
};

export default ({
  selectedItem = mockSelectedItem,
}) => {
  const { t } = useTranslation();
  const { icon, title, subTitle } = useMemo(() => {
    switch (selectedItem?.event_type_id) {
      case EVENT_TYPE.EARLY_CLOCK_IN: {
        return {
          icon: <EarlyClockIn />,
          title: 'Clock In',
          subTitle: 'Early Clock In',
        };
      }
      case EVENT_TYPE.LATE_CLOCK_IN: {
        return {
          icon: <LateClockIn />,
          title: 'Late In',
          subTitle: 'Late Clock In',
        };
      }
      case EVENT_TYPE.MISSING_CLOCK_IN: {
        return {
          icon: <MissedClockIn />,
          title: 'Missing In',
          subTitle: 'Missing Clock In',
        };
      }
      case EVENT_TYPE.EARLY_CLOCK_OUT: {
        return {
          icon: <EarlyClockOut />,
          title: 'Early Out',
          subTitle: 'Early Clock Out',
        };
      }
      case EVENT_TYPE.LATE_CLOCK_OUT: {
        return {
          icon: <LateClockOut />,
          title: 'Late Out',
          subTitle: 'Late Clock Out',
        };
      }
      case EVENT_TYPE.MISSING_CLOCK_OUT: {
        return {
          icon: <MissedClockOut />,
          title: 'Missing Out',
          subTitle: 'Missing Clock Out',
        };
      }
      case EVENT_TYPE.DAILY_OVERTIME_START: {
        return {
          icon: <DailyOvertime />,
          title: 'daily over',
          subTitle: 'Daily overtime start',
        };
      }
      case EVENT_TYPE.WEEKLY_OVERTIME_START: {
        return {
          icon: <WeeklyOvertime />,
          title: 'weekly over',
          subTitle: 'Weekly overtime start',
        };
      }
      default: return {};
    }
  }, [selectedItem?.event_type_id]);

  return (
    <div className={classes.container}>
      <div className={classes.container__icon}>
        {icon}
      </div>
      <span className={classes.container__title}>
        {`${selectedItem.name} ${t('for')} ${t(title)}`}
      </span>
      <span className={classes.container__subTitle}>
        {t(subTitle)}
      </span>
      <span className={classes.container__employee}>
        {selectedItem?.employee}
      </span>
      <span className={classes.container__date}>
        {moment(selectedItem?.timestamp).format('hh:mm DD. MMM, yyyy')}
      </span>
      <EventInformation
        type={selectedItem.event_type_id}
        t={t}
        time={selectedItem.time}
      />
      <div className={classes.container__employeeHabbits}>
        <div className={classes.container__employeeHabbits__header}>
          <UserIcon />
          {t('Employee Habbits')}
        </div>
        <span className={classes.container__employeeHabbits__subTitle}>
          {t('Total times of this event')}
        </span>
        <div className={classes.container__employeeHabbits__item}>
          {t('This Week')}
          <span className={classes.container__employeeHabbits__item__value}>
            {selectedItem?.total?.week}
          </span>
        </div>
        <div className={classes.container__employeeHabbits__item}>
          {t('This Month')}
          <span className={classes.container__employeeHabbits__item__value}>
            {selectedItem?.total?.month}
          </span>
        </div>
        <div className={classes.container__employeeHabbits__item}>
          {t('Total')}
          <span className={classes.container__employeeHabbits__item__value}>
            {selectedItem?.total?.total}
          </span>
        </div>
        <div className={classes.container__employeeHabbits__line} />
      </div>
    </div>
  );
};
