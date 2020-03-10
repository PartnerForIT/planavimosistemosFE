import React, { useState } from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/no-unresolved
import { DateRangePicker } from 'custom-react-daterange-picker';
import { format } from 'date-fns';
import './DRP.scss';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
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

  const { startDate, endDate } = dateRange;

  const classes = classNames({
    calendarIconWrapper: true,
    active: definedRangesOpen,
  });

  const inputClickHandler = () => {
    setOpen(true);
    setDefinedRangesOpen(false);
  };

  return (
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
                {range.label}
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
        value={startDate ? format(startDate, 'MMM, dd, yyyy') : 'Start Date'}
      />
      <span className='to'>{ ' To ' }</span>
      <input
        type='text'
        className='dateInput'
        readOnly
        onClick={() => inputClickHandler()}
        value={endDate ? format(endDate, 'MMM, dd, yyyy') : 'End Date'}
      />
      <DateRangePicker
        initialDateRange={predefinedDateRange}
        open={open}
        onChange={(range) => setDateRange(range)}
      />
    </div>
  );
};

export default DRP;
