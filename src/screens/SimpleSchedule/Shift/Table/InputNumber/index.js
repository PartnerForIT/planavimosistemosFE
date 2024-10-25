import React from 'react';
import classNames from 'classnames';

import ChevronIcon from '../../../../../components/Icons/Chevron';
import classes from './InputNumber.module.scss';

export default ({
  value,
  onChange,
  disabled,
}) => {
  const handleIncrement = () => {
    onChange(+value + 1);
  };
  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };
  const handleChange = (event) => {
    onChange(+event.target.value || 0);
  };

  return (
    <div className={classNames(classes.inputNumber, { [classes.inputNumber_disabled]: disabled })}>
      <input
        type='number'
        min={1}
        className={classes.inputNumber__input}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
      <button
        onClick={handleIncrement}
        className={classes.inputNumber__increment}
      >
        <ChevronIcon />
      </button>
      <button
        onClick={handleDecrement}
        className={classes.inputNumber__decrement}
      >
        <ChevronIcon />
      </button>
    </div>
  );
};
