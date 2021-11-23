import React from 'react';

import classes from './ButtonsField.module.scss';

export default ({
  label,
  value,
  onChange,
  options,
}) => (
  <div className={classes.buttonsField}>
    {
      label && (
        <span className={classes.buttonsField__label}>
          {label}
        </span>
      )
    }
    {
      options.map((item) => (
        <button
          key={item.value}
          // eslint-disable-next-line max-len
          className={`${classes.buttonsField__button} ${item.value === value ? classes.buttonsField__button_selected : ''}`}
          onClick={() => {
            onChange(item.value);
          }}
        >
          {item.label}
        </button>
      ))
    }
  </div>
);
