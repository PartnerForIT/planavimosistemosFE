import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Button from '../../../../components/Core/Button/Button';
import TimeRangePicker from '../../TimeRangePicker';

import classes from './ChangeWorkingTime.module.scss';

export default ({
  photo,
  jobTypeName,
  employeeName,
  onChangeTime,
  start,
  end,
}) => {
  const { t } = useTranslation();
  const [time, setTime] = useState({
    start: moment(start).format('HH:mm'),
    end: moment(end).format('HH:mm'),
  });

  const handleChangeTime = (values) => {
    setTime(values.time);
  };
  const onClickApply = () => {
    onChangeTime(time);
  };

  return (
    <div className={classes.changeWorkingTime}>
      <div className={classes.changeWorkingTime__title}>
        {t('Change Working Time')}
      </div>
      <div className={classes.changeWorkingTime__userInfo}>
        {
          photo && (
            <img
              className={classes.changeWorkingTime__userInfo__avatar}
              alt='avatar'
              src={photo}
            />
          )
        }
        {`${employeeName} • ${jobTypeName}`}
      </div>
      <div className={classes.changeWorkingTime__form}>
        <TimeRangePicker
          value={time}
          // cellId={indexJ}
          onChange={handleChangeTime}
          // disabled={disabledCell}
          // withDots={withDots}
          // jobTypeName={jobType}
          // avatar={avatar}
          // fullName={title}
          // onDuplicateTimeToRow={handleDuplicateTimeToRow}
          // onDuplicateTimeToColumn={handleDuplicateTimeToColumn}
          // disabled={disabledCell}
        />
        <Button onClick={onClickApply}>
          {t('Change Time')}
        </Button>
      </div>
    </div>
  );
};
