import React from 'react';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import classes from './DatePicker.module.scss';

export default ({
  label,
  value,
  onChange,
}) => {
  const handleDateChange = (date) => {
    onChange(date);
  };

  return (
    <div className={classes.datePicker}>
      {
        label && (
          <span className={classes.datePicker__label}>
            {label}
          </span>
        )
      }
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          disableToolbar
          variant='inline'
          value={value}
          onChange={handleDateChange}
          className={classes.datePicker__input}
          format='MMM, DD, YYYY'
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};
