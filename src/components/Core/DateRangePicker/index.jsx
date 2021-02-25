import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { DateRangePicker } from 'custom-react-daterange-picker';
import { format } from 'date-fns';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useTranslation } from 'react-i18next';

import './style.scss';

export default ({
  initRange,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initRange || {});
  const [lastDateRange, setLastDateRange] = useState(initRange || {});
  const { t } = useTranslation();
  const { startDate, endDate } = dateRange;

  const startInputClasses = classNames('date-range-picker__left__input', {
    'date-range-picker__left__input_active': open && ((!startDate && !endDate) || (startDate && endDate)),
  });
  const endInputClasses = classNames('date-range-picker__right__input', {
    'date-range-picker__left__input_active': open && (startDate && typeof endDate === 'undefined'),
  });

  const inputClickHandler = () => {
    if (Object.keys(dateRange).length !== 0 && dateRange.constructor === Object) {
      setLastDateRange(dateRange);
      setDateRange({});
    }
    setOpen(true);
  };
  const handleClickAway = () => {
    if (Object.keys(dateRange).length === 0 && dateRange.constructor === Object
    && Object.keys(lastDateRange).length !== 0 && lastDateRange.constructor === Object) {
      setDateRange(lastDateRange);
      setLastDateRange({});
    }
    setOpen(false);
  };
  const handleChange = (range) => {
    setDateRange(range);
    onChange(range);
  };

  useEffect(() => {
    setDateRange(initRange);
  }, [initRange]);
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      setOpen(false);
    }
  }, [dateRange]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='date-range-picker'>
        <div className='date-range-picker__left'>
          <span className='date-range-picker__left__label'>{t('From')}</span>
          <input
            type='text'
            className={startInputClasses}
            onClick={inputClickHandler}
            value={startDate ? format(startDate, 'MM.dd.yyyy') : t('Start Date')}
            readOnly
          />
        </div>
        <div className='date-range-picker__right'>
          <span className='date-range-picker__left__label'>{t('To')}</span>
          <input
            type='text'
            className={endInputClasses}
            onClick={inputClickHandler}
            value={endDate ? format(endDate, 'MM.dd.yyyy') : t('End Date')}
            readOnly
          />
        </div>
        <div className='date-range-picker__modal'>
          <DateRangePicker
            open={open}
            onChange={handleChange}
            startYear='2018'
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};
