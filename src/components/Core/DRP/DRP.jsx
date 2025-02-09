import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { DateRangePicker } from '@matharumanpreet00/react-daterange-picker';
import moment from 'moment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useTranslation } from 'react-i18next';

import useCompanyInfo from '../../../hooks/useCompanyInfo';
import Button from '../Button/Button';

import './DRP.scss';
import defaultRanges from './defaultRanges';

const DRP = ({
  initRange, onChange, small, right,
}) => {
  const { getDateFormat } = useCompanyInfo();
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });

  const [open, setOpen] = useState(false);
  const [definedRangesOpen, setDefinedRangesOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initRange || {});
  const [lastDateRange, setLastDateRange] = useState(initRange || {});
  const [predefinedDateRange, setPredefinedDateRange] = useState(initRange || {});
  const { t } = useTranslation();
  const { startDate, endDate } = dateRange;

  const classes = classNames({
    calendarIconWrapper: true,
    active: definedRangesOpen,
  });

  const calendarIconClasses = classNames({
    calendarIcon: true,
    calendarIconSmall: small,
  });

  const startInputClasses = classNames({
    dateInput: true,
    dateInputSmall: small,
    active: open && ((!startDate && !endDate) || (startDate && endDate)),
  });

  const endInputClasses = classNames({
    dateInput: true,
    dateInputSmall: small,
    active: open && (startDate && typeof endDate === 'undefined'),
  });

  const definedRangesClasses = classNames({
    definedRanges: true,
    definedRangesRight: right,
  });

  const pickerWrapperClasses = classNames({
    pickerWrapper: true,
    pickerWrapperRight: right,
  });

  const inputClickHandler = () => {
    if (Object.keys(dateRange).length !== 0 && dateRange.constructor === Object) {
      setLastDateRange(dateRange);
      setDateRange({});
    }
    setOpen(true);
    setDefinedRangesOpen(false);
  };

  const handleClickAway = () => {
    if (Object.keys(dateRange).length === 0 && dateRange.constructor === Object
    && Object.keys(lastDateRange).length !== 0 && lastDateRange.constructor === Object) {
      setDateRange(lastDateRange);
      setLastDateRange({});
    }
    setDefinedRangesOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    setDateRange(initRange);
  }, [initRange]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) setOpen(false);
  }, [dateRange]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={pickerWrapperClasses}>
        <div
          role='button'
          tabIndex={0}
          className={classes}
          onClick={() => { setDefinedRangesOpen(!definedRangesOpen); setOpen(false); }}
        >
          <CalendarTodayIcon className={calendarIconClasses} />
        </div>
        {definedRangesOpen
          ? (
            <div className={definedRangesClasses}>
              {defaultRanges.map((range, idx) => (
                <Button
                  key={idx.toString()}
                  onClick={() => {
                    setPredefinedDateRange({ startDate: range.startDate, endDate: range.endDate });
                    setDefinedRangesOpen(false);
                  }}
                  fillWidth
                >
                  {t(range.label)}
                </Button>
              ))}
            </div>
          )
          : null}
        <input
          type='text'
          className={startInputClasses}
          readOnly
          onClick={() => inputClickHandler()}
          value={startDate ? moment(startDate).format(formatDate) : t('Start Date')}
        />
        <span className='to'>{ ` ${t('To')} ` }</span>
        <input
          type='text'
          className={endInputClasses}
          readOnly
          onClick={() => inputClickHandler()}
          value={endDate ? moment(endDate).format(formatDate) : t('End Date')}
        />
        {
          right ? (
            <div className='pickerRightWrapper'>
              <DateRangePicker
                initialDateRange={predefinedDateRange}
                open={open}
                onChange={(range) => onChange(range)}
                startYear='2018'
              />
            </div>
          )
            : (
              <div className='pickerDefaultWrapper'>
                <DateRangePicker
                  initialDateRange={predefinedDateRange}
                  open={open}
                  onChange={(range) => { setDateRange(range); onChange(range); }}
                  startYear='2018'
                />
              </div>
            )
        }
      </div>
    </ClickAwayListener>
  );
};

export default DRP;
