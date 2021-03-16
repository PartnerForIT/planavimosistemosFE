import React from 'react';
import { useTranslation } from 'react-i18next';

import InputSelect from '../../../Core/InputSelect';
import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import { EVENT_TYPE } from '../../../../const';
import classes from '../Events.module.scss';
import Content from './Content';

// 1 Early Clock in
// 2 Late Clock in
// 3 Missing Clock in
// 4 Early Clock out
// 5 Late Clock out
// 6 Missing Clock out

// 7 Daily overtime start
// 8 Weekly overtime start

// 9 Reminder to Clock in
// 10 Reminder to Clock out

// company working hours
// scheduled working hours

const timeMinutesOptions = [
  {
    value: 300,
    label: '5',
  },
  {
    value: 600,
    label: '10',
  },
  {
    value: 900,
    label: '15',
  },
  {
    value: 1200,
    label: '20',
  },
  {
    value: 1500,
    label: '25',
  },
  {
    value: 1800,
    label: '30',
  },
];
const timeHoursOptions = [
  {
    value: 3600,
    label: '1',
  },
  {
    value: 7200,
    label: '2',
  },
  {
    value: 10800,
    label: '3',
  },
  {
    value: 14400,
    label: '4',
  },
  {
    value: 18000,
    label: '5',
  },
  {
    value: 21600,
    label: '6',
  },
];
const timeHours5Options = [
  {
    value: 0,
    label: 'immediately',
  },
  {
    value: 3600,
    label: '1',
  },
  {
    value: 7200,
    label: '2',
  },
  {
    value: 10800,
    label: '3',
  },
  {
    value: 14400,
    label: '4',
  },
  {
    value: 18000,
    label: '5',
  },
];
const timeHours10Options = [
  {
    value: 0,
    label: 'immediately',
  },
  {
    value: 3600,
    label: '1',
  },
  {
    value: 7200,
    label: '2',
  },
  {
    value: 10800,
    label: '3',
  },
  {
    value: 14400,
    label: '4',
  },
  {
    value: 18000,
    label: '5',
  },
  {
    value: 21600,
    label: '6',
  },
  {
    value: 25200,
    label: '7',
  },
  {
    value: 28800,
    label: '8',
  },
  {
    value: 32400,
    label: '9',
  },
  {
    value: 21600,
    label: '10',
  },
];
const timeWithMinutesOptions = [
  {
    value: '00:00',
    label: '00:00',
  },
  {
    value: '0:15',
    label: '0:15',
  },
  {
    value: '0:30',
    label: '0:30',
  },
  {
    value: '0:45',
    label: '0:45',
  },
  {
    value: '01:00',
    label: '01:00',
  },
  {
    value: '1:15',
    label: '1:15',
  },
  {
    value: '1:30',
    label: '1:30',
  },
  {
    value: '1:45',
    label: '1:45',
  },
  {
    value: '02:00',
    label: '02:00',
  },
  {
    value: '2:15',
    label: '2:15',
  },
  {
    value: '2:30',
    label: '2:30',
  },
  {
    value: '2:45',
    label: '2:45',
  },
  {
    value: '03:00',
    label: '03:00',
  },
  {
    value: '3:15',
    label: '3:15',
  },
  {
    value: '3:30',
    label: '3:30',
  },
  {
    value: '3:45',
    label: '3:45',
  },
  {
    value: '04:00',
    label: '04:00',
  },
  {
    value: '4:15',
    label: '4:15',
  },
  {
    value: '4:30',
    label: '4:30',
  },
  {
    value: '4:45',
    label: '4:45',
  },
  {
    value: '05:00',
    label: '05:00',
  },
  {
    value: '5:15',
    label: '5:15',
  },
  {
    value: '5:30',
    label: '5:30',
  },
  {
    value: '5:45',
    label: '5:45',
  },
  {
    value: '06:00',
    label: '06:00',
  },
  {
    value: '6:15',
    label: '6:15',
  },
  {
    value: '6:30',
    label: '6:30',
  },
  {
    value: '6:45',
    label: '6:45',
  },
  {
    value: '07:00',
    label: '07:00',
  },
  {
    value: '7:15',
    label: '7:15',
  },
  {
    value: '7:30',
    label: '7:30',
  },
  {
    value: '7:45',
    label: '7:45',
  },
  {
    value: '08:00',
    label: '08:00',
  },
  {
    value: '8:15',
    label: '8:15',
  },
  {
    value: '8:30',
    label: '8:30',
  },
  {
    value: '8:45',
    label: '8:45',
  },
  {
    value: '9:00',
    label: '9:00',
  },
  {
    value: '9:15',
    label: '9:15',
  },
  {
    value: '9:30',
    label: '9:30',
  },
  {
    value: '9:45',
    label: '9:45',
  },
  {
    value: '10:00',
    label: '10:00',
  },
  {
    value: '10:15',
    label: '10:15',
  },
  {
    value: '10:30',
    label: '10:30',
  },
  {
    value: '10:45',
    label: '10:45',
  },
  {
    value: '11:00',
    label: '11:00',
  },
  {
    value: '11:15',
    label: '11:15',
  },
  {
    value: '11:30',
    label: '11:30',
  },
  {
    value: '11:45',
    label: '11:45',
  },
  {
    value: '12:00',
    label: '12:00',
  },
  {
    value: '12:15',
    label: '12:15',
  },
  {
    value: '12:30',
    label: '12:30',
  },
  {
    value: '12:45',
    label: '12:45',
  },
  {
    value: '13:00',
    label: '13:00',
  },
  {
    value: '13:15',
    label: '13:15',
  },
  {
    value: '13:30',
    label: '13:30',
  },
  {
    value: '13:45',
    label: '13:45',
  },
  {
    value: '14:00',
    label: '14:00',
  },
  {
    value: '14:15',
    label: '14:15',
  },
  {
    value: '14:30',
    label: '14:30',
  },
  {
    value: '14:45',
    label: '14:45',
  },
  {
    value: '15:00',
    label: '15:00',
  },
  {
    value: '15:15',
    label: '15:15',
  },
  {
    value: '15:30',
    label: '15:30',
  },
  {
    value: '15:45',
    label: '15:45',
  },
  {
    value: '16:00',
    label: '16:00',
  },
  {
    value: '16:15',
    label: '16:15',
  },
  {
    value: '16:30',
    label: '16:30',
  },
  {
    value: '16:45',
    label: '16:45',
  },
  {
    value: '17:00',
    label: '17:00',
  },
  {
    value: '17:15',
    label: '17:15',
  },
  {
    value: '17:30',
    label: '17:30',
  },
  {
    value: '17:45',
    label: '17:45',
  },
  {
    value: '18:00',
    label: '18:00',
  },
  {
    value: '18:15',
    label: '18:15',
  },
  {
    value: '18:30',
    label: '18:30',
  },
  {
    value: '18:45',
    label: '18:45',
  },
  {
    value: '19:00',
    label: '19:00',
  },
  {
    value: '19:15',
    label: '19:15',
  },
  {
    value: '19:30',
    label: '19:30',
  },
  {
    value: '19:45',
    label: '19:45',
  },
  {
    value: '20:00',
    label: '20:00',
  },
  {
    value: '20:15',
    label: '20:15',
  },
  {
    value: '20:30',
    label: '20:30',
  },
  {
    value: '20:45',
    label: '20:45',
  },
  {
    value: '21:00',
    label: '21:00',
  },
  {
    value: '21:15',
    label: '21:15',
  },
  {
    value: '21:30',
    label: '21:30',
  },
  {
    value: '21:45',
    label: '21:45',
  },
  {
    value: '22:00',
    label: '22:00',
  },
  {
    value: '22:15',
    label: '22:15',
  },
  {
    value: '22:30',
    label: '22:30',
  },
  {
    value: '22:45',
    label: '22:45',
  },
  {
    value: '23:00',
    label: '23:00',
  },
  {
    value: '23:15',
    label: '23:15',
  },
  {
    value: '23:30',
    label: '23:30',
  },
  {
    value: '23:45',
    label: '23:45',
  },
];
const afterWorkOptions = [
  {
    value: 0,
    label: 'company working hours',
  },
  {
    value: 1,
    label: 'scheduled working hours',
  },
];

export default React.memo(({
  values,
  eventsTypes,
  handleChangeCheckbox,
  handleChangeValue,
}) => {
  const { t } = useTranslation();
  const handleChangeSelect = ({ target }) => {
    handleChangeValue({
      [target.name]: target.value,
    });
  };
  // console.log('values', values.time);

  return (
    <Content title='Event Rule' tooltip='Tooltip'>
      <InputSelect
        name='event_type_id'
        value={values.event_type_id}
        onChange={handleChangeSelect}
        options={eventsTypes}
        valueKey='id'
        labelKey='name'
      />
      {
        (values.event_type_id === EVENT_TYPE.MISSING_CLOCK_OUT) && (
          <>
            <div className={classes.eventRule__content}>
              {t('Notify if a user has not clocked out after')}
              {' '}
              <InputSelect
                name='time'
                className={classes.eventRule__content__input}
                small
                value={values.time}
                onChange={handleChangeSelect}
                options={timeHoursOptions}
              />
              {' '}
              {t('hours from the time then work finishes based on a')}
            </div>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
          </>
        )
      }
      {
        (values.event_type_id === EVENT_TYPE.MISSING_CLOCK_IN) && (
          <>
            <div className={classes.eventRule__content}>
              {t('Notify if a user has not clocked in after')}
              {' '}
              <InputSelect
                name='time'
                className={classes.eventRule__content__input}
                small
                value={values.time}
                onChange={handleChangeSelect}
                options={timeHoursOptions}
              />
              {' '}
              {t('hours from the time then work starts')}
            </div>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.EARLY_CLOCK_IN && (
          <>
            <div className={classes.eventRule__content}>
              {t('Notify if a user has started work earlier than')}
              {' '}
              <InputSelect
                name='time'
                className={classes.eventRule__content__input}
                small
                value={values.time}
                onChange={handleChangeSelect}
                options={timeMinutesOptions}
              />
              {' '}
              {t('minutes before work starts based on a')}
            </div>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.LATE_CLOCK_IN && (
          <>
            <div className={classes.eventRule__content}>
              {t('Notify if user has started work later than')}
              {' '}
              <InputSelect
                name='time'
                className={classes.eventRule__content__input}
                small
                value={values.time}
                onChange={handleChangeSelect}
                options={timeMinutesOptions}
              />
              {' '}
              {t('minutes after work ends based on a')}
            </div>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.EARLY_CLOCK_OUT && (
          <>
            <div className={classes.eventRule__content}>
              {t('Notify if user has finished work earlier than')}
              {' '}
              <InputSelect
                name='time'
                className={classes.eventRule__content__input}
                small
                value={values.time}
                onChange={handleChangeSelect}
                options={timeMinutesOptions}
              />
              {' '}
              {t('minutes before work ends based on a')}
            </div>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.LATE_CLOCK_OUT && (
          <>
            <div className={classes.eventRule__content}>
              {t('Notify if user has finished work later than')}
              {' '}
              <InputSelect
                name='time'
                className={classes.eventRule__content__input}
                small
                value={values.time}
                onChange={handleChangeSelect}
                options={timeMinutesOptions}
              />
              {' '}
              {t('minutes after work ends based on a')}
            </div>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.WEEKLY_OVERTIME_START && (
          <>
            <div className={classes.eventRule__content}>
              {t('Then weekly overtime starts, notify after')}
              {' '}
              <InputSelect
                name='time'
                small
                className={classes.eventRule__content__input}
                value={values.time}
                onChange={handleChangeSelect}
                options={timeHours10Options}
              />
            </div>
            <StyledCheckbox
              label={t('Automatically stop work')}
              id='stop_work'
              onChange={handleChangeCheckbox}
              checked={values.stop_work}
            />
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.DAILY_OVERTIME_START && (
          <>
            <div className={classes.eventRule__content}>
              {t('Then daily overtime starts, notify after')}
              {' '}
              <InputSelect
                name='time'
                small
                className={classes.eventRule__content__input}
                value={values.time}
                onChange={handleChangeSelect}
                options={timeHours5Options}
              />
            </div>
            <StyledCheckbox
              label={t('Automatically stop work')}
              id='stop_work'
              onChange={handleChangeCheckbox}
              checked={values.stop_work}
            />
          </>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.REMINDER_TO_CLOCK_IN && (
          <div className={classes.reminderTo}>
            <StyledCheckbox
              label={t('Reminder on specific time')}
              id='stop_work'
              onChange={handleChangeCheckbox}
              checked={values.stop_work}
              borderRadius={50}
            />
            {t('Clock In reminder at')}
            {' '}
            <span />
            <InputSelect
              name='time'
              small
              className={classes.reminderTo__select}
              value={values.time}
              onChange={handleChangeSelect}
              options={timeWithMinutesOptions}
            />
            <div className={classes.reminderTo__delimiter} />
            <StyledCheckbox
              label={t('Reminder based on settings')}
              id='stop_work'
              onChange={handleChangeCheckbox}
              checked={values.stop_work}
              borderRadius={50}
            />
            {t('Clock in reminder in')}
            {' '}
            <span />
            <InputSelect
              name='time'
              small
              className={classes.reminderTo__select}
              value={values.time}
              onChange={handleChangeSelect}
              options={timeMinutesOptions}
            />
            {' '}
            {t('minutes before')}
            <div className={classes.reminderTo__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
            {t('starts.')}
          </div>
        )
      }
      {
        values.event_type_id === EVENT_TYPE.REMINDER_TO_CLOCK_OUT && (
          <>
            <div className={classes.eventRule__wrapperSelect}>
              <InputSelect
                name='day_time'
                value={values.day_time}
                onChange={handleChangeSelect}
                options={afterWorkOptions}
                small
              />
            </div>
            {t('finishes.')}
          </>
        )
      }
    </Content>
  );
});
