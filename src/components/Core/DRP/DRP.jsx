import React from 'react';
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
  const [open, setOpen] = React.useState(false);
  const [definedRangesOpen, setDefinedRangesOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({});

  const { startDate, endDate } = dateRange;

  const classes = classNames({
    calendarIconWrapper: true,
    active: definedRangesOpen,
  });

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
                onClick={() => { setDateRange({ startDate: range.startDate, endDate: range.endDate }); }}
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
        onClick={() => { setOpen(true); setDefinedRangesOpen(false); }}
        value={startDate ? format(startDate, 'MMM, dd, yyyy') : 'Start Date'}
      />
      <span className='to'>{ ' To ' }</span>
      <input
        type='text'
        className='dateInput'
        onClick={() => { setOpen(true); setDefinedRangesOpen(false); }}
        value={endDate ? format(endDate, 'MMM, dd, yyyy') : 'End Date'}
      />
      <DateRangePicker
        initialDateRange={dateRange}
        open={open}
        onChange={(range) => setDateRange(range)}
      />
    </div>
  );
};

export default DRP;
