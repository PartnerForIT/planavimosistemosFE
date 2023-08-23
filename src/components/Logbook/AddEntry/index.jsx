import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import moment from 'moment';
import { userSelector } from '../../../store/auth/selectors';

import Dialog from '../../Core/Dialog';
import Label from '../../Core/InputLabel';
import SimpleSelect from '../../Core/SimpleSelect';
import Textarea from '../../Core/Textarea/Textarea';
import PendingIcon from '../../Icons/PendingIcon';
import usePermissions from '../../Core/usePermissions';
import Input from '../../Core/Input/Input';
import { employeesSelector, JournalDataSelector } from '../../../store/settings/selectors';
import { jobTypesSelector } from '../../../store/jobTypes/selectors';
import { placesSelector } from '../../../store/places/selectors';
import classes from './AddEntry.module.scss';

const formatChars = {
  2: '[0-2]',
  3: '[0-3]',
  5: '[0-5]',
  9: '[0-9]',
};

const MiniCardInfo = ({
  icon,
  label,
  orange = false,
  className,
  hours = '0',
  minutes = '0',
}) => (
  <div className={classNames(classes.miniCardInfo, { [classes.miniCardInfo_orange]: orange, [className]: className })}>
    {icon}
    <span className={classes.miniCardInfo__label}>
      {label}
    </span>
    <span className={classes.miniCardInfo__value}>
      {hours}
    </span>
    <span className={classes.miniCardInfo__time}>
      h
    </span>
    <span className={classes.miniCardInfo__value}>
      {minutes}
    </span>
    <span className={classes.miniCardInfo__time}>
      min
    </span>
  </div>
);

const TimePart = ({
  id,
  label,
  orange,
  prev,
  next,
  started,
  finished,
  onChange,
}) => {
  const container = classNames(
    classes.timePart
  );

  const handleChange = (values) => {
    onChange({ id, ...values });
  };
  const handleChangeTime = (e) => {
    switch (e.target.name) {
      case 'finished': {
      //   if (finished[0] !== e.target.value[0] && e.target.value[0] === '2') {
      //     handleChange({ [e.target.name]: '20:00' });
      //   } else {
      //     handleChange({ [e.target.name]: e.target.value });
      //   }

        handleChange({ [e.target.name]: e.target.value });
        break;
      }
      case 'started': {
        // if (started[0] !== e.target.value[0] && e.target.value[0] === '2') {
        //   handleChange({ [e.target.name]: '20:00' });
        // } else {
        //   handleChange({ [e.target.name]: e.target.value });
        // }

        handleChange({ [e.target.name]: e.target.value });
        break;
      }
      default: break;
    }
  };
  const handleBlurTime = (e) => {
    switch (e.target.name) {
      case 'finished': {
        if (moment(started).isSameOrAfter(moment(e.target.value))) {
          e.target.value = started
        }

        handleChange({ [e.target.name]: e.target.value });
        break;
      }
      case 'started': {
        if (moment(e.target.value).isSameOrAfter(moment(finished))) {
          e.target.value = finished
        }

        handleChange({ [e.target.name]: e.target.value });
        break;
      }
      default: break;
    }
  };

  //const formatCharsStarted = useMemo(() => (started[0] === '2' ? '23:59' : '29:59'), [started]);
  //const formatCharsFinished = useMemo(() => (finished[0] === '2' ? '23:59' : '29:59'), [finished]);

  return (
    <div className={container}>
      <span className={classes.timePart__label}>
        {label}
      </span>
      <div className={classes.timePart__container}>
        <div className={classes.timePart__inputs}>
          <Input
            name='started'
            type='datetime-local'
            max={moment(finished).format('YYYY-MM-DDTHH:mm')}
            value={moment(started).format('YYYY-MM-DD HH:mm')}
            onChange={handleChangeTime}
            onBlur={handleBlurTime}
          />
          <Input
            name='finished'
            type='datetime-local'
            min={moment(started).format('YYYY-MM-DDTHH:mm')}
            value={moment(finished).format('YYYY-MM-DD HH:mm')}
            onChange={handleChangeTime}
            onBlur={handleBlurTime}
          />
        </div>
      </div>
    </div>
  );
};

const permissionsConfig = [
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'jobs',
    module: 'create_jobs',
  },
  {
    name: 'app_manager',
    permission: 'app_manager',
  },
  {
    name: 'comments_photo',
    module: 'comments_photo',
  },
];
export default ({
  handleClose,
  open,
  onClickSave,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({});
  const [timeParts, setTimeParts] = useState([]);
  const permissions = usePermissions(permissionsConfig);

  const allJobTypes = useSelector(jobTypesSelector);
  const allPlaces = useSelector(placesSelector);
  const { users: allEmployees } = useSelector(employeesSelector);
  const journal = useSelector(JournalDataSelector);
  const user = useSelector(userSelector);

  useEffect(() => {
    if (open) {
      setFormValues({
        job_type_id: null,
        place_id: null,
        employee_id: user?.employee?.id || null,
        comment: '',
      });
      setTimeParts(
        [
          {
            started_at: moment().format('YYYY-MM-DD HH:mm'),
            finished_at: moment().format('YYYY-MM-DD HH:mm'),
            started: moment().format('HH:mm'),
            finished: moment().format('HH:mm'),
          }
        ].sort((a, b) => moment(a.started_at).diff(b.started_at)),
      );
    }
  }, [open, setTimeParts]);

  const employees = useMemo(() => allEmployees.map((empl) => {
    const {
      // eslint-disable-next-line camelcase,no-shadow
      id, name, surname
    } = empl;
    return {
      id: id,
      name: `${name} ${surname}`,
    };
  }) ?? [], [allEmployees]);

  const handleExited = () => {};
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextInputValues = { ...formValues, [name]: value };
    setFormValues(nextInputValues);
  };
  const handleChangeTimePart = (values) => {
    let nextValues = { ...values };
    if (nextValues['started']) {
      nextValues['started_at'] = moment(nextValues['started']).format('YYYY-MM-DD HH:mm');
      nextValues['started'] = moment(nextValues['started']).format('HH:mm');
    }
    if (nextValues['finished']) {
      nextValues['finished_at'] = moment(nextValues['finished']).format('YYYY-MM-DD HH:mm');
      nextValues['finished'] = moment(nextValues['finished']).format('HH:mm');
    }
    const foundIndex = timeParts.findIndex((item) => (item.id === values.id));

    if (values.finished) {
      const finished = values.finished.split(':');
      const endTimeInMinutes = (finished[0] * 60 + +finished[1]);

      const started = timeParts[foundIndex].started.split(':');
      const startTimeInMinutes = (started[0] * 60 + +started[1]);

      if (endTimeInMinutes < startTimeInMinutes) {
        //nextValues.finished = timeParts[foundIndex].finished;
      }
    } else if (values.started) {
      const started = values.started.split(':');
      const startTimeInMinutes = (started[0] * 60 + +started[1]);

      const finished = timeParts[foundIndex].finished.split(':');
      const endTimeInMinutes = (finished[0] * 60 + +finished[1]);

      if (startTimeInMinutes > endTimeInMinutes) {
        //nextValues.started = timeParts[foundIndex].started;
      }
    }

    if (values.finished && foundIndex < timeParts.length - 1) {
      const finished = values.finished.split(':');
      const endTimeInMinutes = (finished[0] * 60 + +finished[1]);

      const started = timeParts[foundIndex + 1].started.split(':');
      const startTimeInMinutes = (started[0] * 60 + +started[1]);

      // The end time of the current time interval is longer than the start time of the next time interval
      if (endTimeInMinutes > startTimeInMinutes) {
        nextValues.finished = timeParts[foundIndex + 1].started;
      }
    } else if (values.started && foundIndex > 0) {
      const started = values.started.split(':');
      const startTimeInMinutes = (started[0] * 60 + +started[1]);

      const finished = timeParts[foundIndex - 1].finished.split(':');
      const endTimeInMinutes = (finished[0] * 60 + +finished[1]);

      // The start time of the current time interval is less than the end time of the previous time interval
      if (startTimeInMinutes < endTimeInMinutes) {
        nextValues.started = timeParts[foundIndex - 1].finished;
      }
    }

    setTimeParts((prevValues) => [
      ...prevValues.slice(0, foundIndex),
      {
        ...prevValues[foundIndex],
        ...nextValues,
      },
      ...prevValues.slice(foundIndex + 1),
    ]);
  };
  const handleClickSave = () => {
    if (!formValues.employee_id) return;

    const { works } = timeParts.reduce((acc, item) => {
      const timeStart = item.started.split(':');
      const timeEnd = item.finished.split(':');
      const nightTime = (timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1]);
      let push = {
        ...item,
        started_at: moment(item.started_at)
          .set({
            h: item.started.split(':')[0],
            m: item.started.split(':')[1],
            s: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss'),
        finished_at: moment(item.finished_at)
          .set({
            h: item.finished.split(':')[0],
            m: item.finished.split(':')[1],
            s: 0,
          })
          .format('YYYY-MM-DD HH:mm:ss'),
      };

      if (nightTime) {
        push.finished_at = moment(push.finished_at).set("date", moment(push.started_at).format('D')).add(1,'days').format('YYYY-MM-DD HH:mm:ss'); 
      }

      acc['works'].push(push);

      return acc;
    }, { works: [] });
    onClickSave({
      ...formValues,
      works,
    });
  };

  const {
    fromTime,
    toTime,
    totalWorkTime,
  } = useMemo(() => {
    if (!timeParts.length) {
      return {};
    }

    const body = {
      fromTime: '',
      toTime: '',
      totalWorkTime: 0,
    };

    timeParts.forEach((item) => {
      //const finished = item.finished.split(':');
      //const started = item.started.split(':');
      //const totalTime = (finished[0] * 60 + +finished[1]) - (started[0] * 60 + +started[1]);

      let start = moment(item.started_at);
      let end = moment(item.finished_at);
      if( end.isBefore(start) ){
        //end.add(1, 'day');
      }
      const dur = moment.duration(end.diff(start))
      const totalTime = dur.asMinutes();


      if (!body.fromTime) {
        body.fromTime = item.started;
        body.toTime = item.finished;
      }

      body.totalWorkTime += totalTime;
    });

    body.totalWorkTime = {
      hours: Math.floor(body.totalWorkTime / 60),
      minutes: Math.round(body.totalWorkTime % 60),
    };
    return body;
  }, [timeParts]);

  return (
    <Dialog
      handleClose={handleClose}
      onExited={handleExited}
      open={!!open}
      title={t('Add new entry')}
      maxWidth='xs'
      classes={{ paper: classes.modal }}
    >
      <Scrollbar
        className={classes.scrollbar}
        removeTracksWhenNotUsed
        noScrollX
        trackYProps={{
          renderer: ({ elementRef, ...restProps}) => (
            <span
              {...restProps}
              ref={elementRef}
              className={classes.scrollbarTrackY}
            />
          ),
        }}
      >
        <div className={classes.addEntry}>
          
          {
            permissions.app_manager && (
              <div className={classes.addEntry__formControl}>
                <div className={classes.addEntry__formControl__labelBlock}>
                  <Label text={t('Employee')} htmlFor='employee' />
                </div>
                <SimpleSelect
                  handleInputChange={handleInputChange}
                  name='employee_id'
                  fullWidth
                  value={formValues.employee_id}
                  options={employees}
                  valueKey='id'
                  labelKey='name'
                  require
                />
              </div>
            )
          }
          {
            permissions.jobs && !!allJobTypes.length && (
              <div className={classes.addEntry__formControl}>
                <div className={classes.addEntry__formControl__labelBlock}>
                  <Label text={t('Job')} htmlFor='job' />
                </div>
                <SimpleSelect
                  handleInputChange={handleInputChange}
                  name='job_type_id'
                  fullWidth
                  value={formValues.job_type_id}
                  options={allJobTypes}
                  valueKey='id'
                  labelKey='title'
                />
              </div>
            )
          }
          {
            permissions.places && !!allPlaces.length && (
              <div className={classes.addEntry__formControl}>
                <div className={classes.addEntry__formControl__labelBlock}>
                  <Label text={t('Place')} htmlFor='place' />
                </div>
                <SimpleSelect
                  handleInputChange={handleInputChange}
                  name='place_id'
                  fullWidth
                  value={formValues.place_id}
                  valueKey='id'
                  labelKey='name'
                  options={allPlaces}
                />
              </div>
            )
          }
          <div className={classes.addEntry__line} />
          <div className={classes.addEntry__infoBlock}>
            <span className={classes.addEntry__infoBlock__label}>
              {t('From')}
            </span>
            <span className={classes.addEntry__infoBlock__value}>
              {fromTime || '0:00'}
            </span>
            <span className={classes.addEntry__infoBlock__label}>
              {t('To')}
            </span>
            <span className={classes.addEntry__infoBlock__value}>
              {toTime || '0:00'}
            </span>
          </div>
          <MiniCardInfo
            hours={totalWorkTime?.hours}
            minutes={totalWorkTime?.minutes}
            label={t('Total hours')}
            icon={<PendingIcon className={classes.pendingIcon} />}
          />
          {
            timeParts.map((item, index) => (
              <TimePart
                key={index}
                //id={item.id}
                label={t('Work part')}
                next={timeParts[index+1] ? timeParts[index+1].started_at : false}
                prev={timeParts[index-1] ? timeParts[index-1].finished_at : false}
                started={item.started_at}
                finished={item.finished_at}
                onChange={handleChangeTimePart}
              />
            ))
          }
          {
            permissions.comments_photo && journal.end_day_comment && (
              <Textarea
                label={t('Comment')}
                placeholder={t('Add new comment here')}
                onChange={handleInputChange}
                name='comment'
                value={formValues.comment}
              />
            )
          }
        </div>
      </Scrollbar>
      <button onClick={handleClickSave} className={classNames(classes.buttonSave, {[classes.buttonSaveNonActive]: !formValues.employee_id})}>
        {t('Save & Close')}
      </button>
    </Dialog>
  );
};
