import React, { useState } from 'react';
import classNames from 'classnames';
import { DateRangePicker } from 'custom-react-daterange-picker';
import { format } from 'date-fns';
import './DRP.scss';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import defaultRanges from './defaultRanges';


/**
 * Simple Button encapsulating all design variations
 */
const DRP = () => {
  const [open, setOpen] = useState(false);
  const [definedRangesOpen, setDefinedRangesOpen] = useState(false);
  const [dateRange, setDateRange] = useState({});
  const [predefinedDateRange, setPredefinedDateRange] = useState({});
  const { t } = useTranslation();
  const { startDate, endDate } = dateRange;

  const classes = classNames({
    calendarIconWrapper: true,
    active: definedRangesOpen,
  });

  const inputClickHandler = () => {
    setOpen(true);
    setDefinedRangesOpen(false);
  };

  const handleClickAway = () => {
    setDefinedRangesOpen(false);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='pickerWrapper'>
        <div
          role='button'
          tabIndex={0}
          className={classes}
          onClick={() => { setDefinedRangesOpen(!definedRangesOpen); setOpen(false); }}
        >
          <CalendarTodayIcon className='calendarIcon' />
        </div>
        {definedRangesOpen
          ? (
            <div className='definedRanges'>
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
          className='dateInput'
          readOnly
          onClick={() => inputClickHandler()}
          value={startDate ? format(startDate, 'MMM, dd, yyyy') : t('Start Date')}
        />
        <span className='to'>{ ` ${t('To')} ` }</span>
        <input
          type='text'
          className='dateInput'
          readOnly
          onClick={() => inputClickHandler()}
          value={endDate ? format(endDate, 'MMM, dd, yyyy') : t('End Date')}
        />
        <DateRangePicker
          initialDateRange={predefinedDateRange}
          open={open}
          onChange={(range) => setDateRange(range)}
        />
      </div>
    </ClickAwayListener>
  );
};

export default DRP;
