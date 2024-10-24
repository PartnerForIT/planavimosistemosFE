import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Button from '../../../../components/Core/Button/Button';
import TimeRangePicker from '../../Shift/TimeRangePicker';
import Cross from "../../../../components/Icons/Cross";

import classes from './AddWorkingTime.module.scss';
import classnames from 'classnames';

export default ({
  onClose,
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
    <div className={classnames(classes.changeWorkingTime, 'change-working-time')}>
      <div onClick={onClose} className={classes.changeWorkingTime__close}><Cross/></div>
      
      <div className={classes.changeWorkingTime__title}>
        {t('Add Working Time')}
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
          onChange={handleChangeTime}
        />
        <Button onClick={onClickApply}>
          {t('Add Time')}
        </Button>
      </div>
    </div>
  );
};
