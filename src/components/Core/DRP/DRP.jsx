import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { DateRangePicker } from 'custom-react-daterange-picker';
import { format } from 'date-fns';
import './DRP.scss';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import defaultRanges from './defaultRanges';


const DRP = ({
  initRange, onChange, small, right,
}) => {
  const [open, setOpen] = useState(false);
  const [definedRangesOpen, setDefinedRangesOpen] = useState(false);
  const [dateRange, setDateRange] = useState(initRange || {});
  const [predefinedDateRange, setPredefinedDateRange] = useState({});
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

  const inputClasses = classNames({
    dateInput: true,
    dateInputSmall: small,
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
    setOpen(true);
    setDefinedRangesOpen(false);
  };

  const handleClickAway = () => {
    setDefinedRangesOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    setDateRange(initRange);
  }, [initRange]);

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
                  onClick={() => { setPredefinedDateRange({ startDate: range.startDate, endDate: range.endDate }); }}
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
          className={inputClasses}
          readOnly
          onClick={() => inputClickHandler()}
          value={startDate ? format(startDate, 'MMM, dd, yyyy') : t('Start Date')}
        />
        <span className='to'>{ ` ${t('To')} ` }</span>
        <input
          type='text'
          className={inputClasses}
          readOnly
          onClick={() => inputClickHandler()}
          value={endDate ? format(endDate, 'MMM, dd, yyyy') : t('End Date')}
        />
        {
          right ? (
            <div className='pickerRightWrapper'>
              <DateRangePicker
                initialDateRange={predefinedDateRange}
                open={open}
                onChange={(range) => onChange(range)}
              />
            </div>
          )
            : (
              <div className='pickerDefaultWrapper'>
                <DateRangePicker
                  initialDateRange={predefinedDateRange}
                  open={open}
                  onChange={(range) => onChange(range)}
                />
              </div>
            )
        }
      </div>
    </ClickAwayListener>
  );
};

export default DRP;
