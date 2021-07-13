import React from 'react';

import Checkbox from '../../../../../../Core/Checkbox/Checkbox';
import InputNumber from '../../../InputNumber';
import classes from './Item.module.scss';

export default ({
  label,
  id,
  onChange,
  value,
  checked,
}) => {
  const handleChange = (nextValue) => {
    onChange({ id, value: nextValue });
  };
  const handleChangeCheckbox = (_, nextChecked) => {
    onChange({ id, checked: nextChecked });
  };

  return (
    <div className={classes.item}>
      <Checkbox
        onChange={handleChangeCheckbox}
        checked={checked}
        label={label}
        name='logbook'
      />
      <InputNumber
        value={value}
        disabled={!checked}
        onChange={handleChange}
      />
    </div>
  );
};
