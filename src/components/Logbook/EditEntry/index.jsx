import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import moment from 'moment';
import InputMask from 'react-input-mask';

import Dialog from '../../Core/Dialog';
import Label from '../../Core/InputLabel';
import SimpleSelect from '../../Core/SimpleSelect';
import PendingIcon from '../../Icons/PendingIcon';
import usePermissions from '../../Core/usePermissions';
import TrashIcon from '../../Icons/TrashIcon';
import RefreshArrow from '../../Icons/RefreshArrow';
import PauseIcon from '../../Icons/PauseIcon';
import { jobTypesSelector } from '../../../store/jobTypes/selectors';
import { placesSelector } from '../../../store/places/selectors';
import classes from './EditEntry.module.scss';

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
  remove,
  orange,
  started,
  finished,
  onChange,
}) => {
  const container = classNames(
    classes.timePart,
    {
      [classes.timePart_remove]: remove,
      [classes.timePart_orange]: orange,
    },
  );

  const handleChange = (values) => {
    onChange({ id, ...values });
  };
  const handleChangeTime = (e) => {
    switch (e.target.name) {
      case 'finished': {
        if (finished[0] !== e.target.value[0] && e.target.value[0] === '2') {
          handleChange({ [e.target.name]: '20:00' });
        } else {
          handleChange({ [e.target.name]: e.target.value });
        }
        break;
      }
      case 'started': {
        if (started[0] !== e.target.value[0] && e.target.value[0] === '2') {
          handleChange({ [e.target.name]: '20:00' });
        } else {
          handleChange({ [e.target.name]: e.target.value });
        }
        break;
      }
      default: break;
    }
  };
  const handleClick = () => {
    handleChange({ isRemove: !remove });
  };

  const formatCharsStarted = useMemo(() => (started[0] === '2' ? '23:59' : '29:59'), [started]);
  const formatCharsFinished = useMemo(() => (finished[0] === '2' ? '23:59' : '29:59'), [finished]);

  return (
    <div className={container}>
      <span className={classes.timePart__label}>
        {label}
      </span>
      <div className={classes.timePart__container}>
        <InputMask
          mask={formatCharsStarted}
          name='started'
          maskChar='0'
          formatChars={formatChars}
          value={started}
          onChange={handleChangeTime}
        />
        <InputMask
          mask={formatCharsFinished}
          name='finished'
          maskChar='0'
          formatChars={formatChars}
          value={finished}
          onChange={handleChangeTime}
        />
        <button onClick={handleClick} className={classes.timePart__container__button}>
          {
            remove
              ? <RefreshArrow className={classes.timePart__container__button__refreshIcon} />
              : <TrashIcon />
          }
        </button>
      </div>
    </div>
  );
};

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

const permissionsConfig = [
  {
    name: 'places',
    module: 'create_places',
  },
  {
    name: 'jobs',
    module: 'create_jobs',
  },
];
export default ({
  handleClose,
  open,
  selectedItem,
  onClickSave,
}) => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({});
  const [timeParts, setTimeParts] = useState([]);
  const permissions = usePermissions(permissionsConfig);

  const allJobTypes = useSelector(jobTypesSelector);
  const allPlaces = useSelector(placesSelector);

  useEffect(() => {
    if (open) {
      setFormValues({
        job_type_id: selectedItem.job_type_id,
        place_id: selectedItem.place_id,
      });
      setTimeParts(
        [
          ...selectedItem.works.map((item, index) => ({
            ...item,
            id: item.id,
            job_type_id: item.job_type_id,
            place_id: item.place_id,
            started_at: item.started_at,
            finished_at: item.finished_at,
            started: moment(item.started_at).format('HH:mm'),
            finished: moment(item.finished_at).format('HH:mm'),
            isWork: true,
            number: index + 1,
          })),
          ...selectedItem.breaks.map((item, index) => ({
            id: item.id,
            job_type_id: item.job_type_id,
            place_id: item.place_id,
            started_at: item.started_at,
            finished_at: item.finished_at,
            started: moment(item.started_at).format('HH:mm'),
            finished: moment(item.finished_at).format('HH:mm'),
            number: index + 1,
          })),
        ].sort((a, b) => moment(a.started_at).diff(b.started_at)),
      );
    }
  }, [open, selectedItem, setTimeParts]);

  const handleExited = () => {};
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const nextInputValues = { ...formValues, [name]: value };
    setFormValues(nextInputValues);
  };
  const handleChangeTimePart = (values) => {
    const nextValues = { ...values };
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
    const { works, breaks } = timeParts.reduce((acc, item) => {
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
        delete: item.isRemove ? 1 : 0,
      };

      if (nightTime) {
        push.finished_at = moment(push.finished_at).set("date", moment(push.started_at).format('D')).add(1,'days').format('YYYY-MM-DD HH:mm:ss'); 
      }

      acc[item.isWork ? 'works' : 'breaks'].push(push);

      return acc;
    }, { works: [], breaks: [] });
    onClickSave({
      ...selectedItem,
      ...formValues,
      works,
      breaks,
    });
  };

  const {
    fromTime,
    toTime,
    totalWorkTime,
    totalBreakTime,
  } = useMemo(() => {
    if (!timeParts.length) {
      return {};
    }

    const body = {
      fromTime: '',
      toTime: '',
      totalWorkTime: 0,
      totalBreakTime: 0,
    };

    timeParts.forEach((item) => {
      if (!item.isRemove) {
        //const finished = item.finished.split(':');
        //const started = item.started.split(':');
        //const totalTime = (finished[0] * 60 + +finished[1]) - (started[0] * 60 + +started[1]);

        let start = moment(item.started, "HH:mm");
        let end = moment(item.finished, "HH:mm");
        if( end.isBefore(start) ){
          end.add(1, 'day');
        }
        const dur = moment.duration(end.diff(start))
        const totalTime = dur.asMinutes();


        if (!body.fromTime) {
          body.fromTime = item.started;
          body.toTime = item.finished;
        }

        if (item.isWork) {
          body.totalWorkTime += totalTime;
        } else {
          body.totalBreakTime += totalTime;
        }
      }
    });

    body.totalWorkTime = {
      hours: Math.floor(body.totalWorkTime / 60),
      minutes: body.totalWorkTime % 60,
    };
    body.totalBreakTime = {
      hours: Math.floor(body.totalBreakTime / 60),
      minutes: body.totalBreakTime % 60,
    };
    return body;
  }, [timeParts]);

  return (
    <Dialog
      handleClose={handleClose}
      onExited={handleExited}
      open={!!open}
      title={t('Edit Entry')}
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
        <div className={classes.editEntry}>
          {
            permissions.jobs && !!allJobTypes.length && (
              <div className={classes.editEntry__formControl}>
                <div className={classes.editEntry__formControl__labelBlock}>
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
              <div className={classes.editEntry__formControl}>
                <div className={classes.editEntry__formControl__labelBlock}>
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
          <div className={classes.editEntry__line} />
          <div className={classes.editEntry__infoBlock}>
            <span className={classes.editEntry__infoBlock__label}>
              {t('From')}
            </span>
            <span className={classes.editEntry__infoBlock__value}>
              {fromTime || '0:00'}
            </span>
            <span className={classes.editEntry__infoBlock__label}>
              {t('To')}
            </span>
            <span className={classes.editEntry__infoBlock__value}>
              {toTime || '0:00'}
            </span>
          </div>
          <MiniCardInfo
            hours={totalWorkTime?.hours}
            minutes={totalWorkTime?.minutes}
            label={t('Total hours')}
            icon={<PendingIcon className={classes.pendingIcon} />}
          />
          <MiniCardInfo
            hours={totalBreakTime?.hours}
            minutes={totalBreakTime?.minutes}
            label={t('On break')}
            orange
            icon={<PauseIcon className={classes.pauseIcon} />}
          />
          {
            timeParts.map((item) => (
              <TimePart
                key={item.id}
                id={item.id}
                label={`${item.isWork ? t('Work part') : t('Break part')} ${item.number}`}
                orange={!item.isWork}
                started={item.started}
                finished={item.finished}
                onChange={handleChangeTimePart}
                remove={item.isRemove}
              />
            ))
          }
        </div>
      </Scrollbar>
      <button onClick={handleClickSave} className={classes.buttonSave}>
        {t('Save & Close')}
      </button>
    </Dialog>
  );
};
