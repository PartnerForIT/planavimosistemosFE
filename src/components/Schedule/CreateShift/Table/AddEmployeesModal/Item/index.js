import React from 'react';

import Checkbox from '../../../../../Core/Checkbox/Checkbox';
import classes from './Item.module.scss';

export default ({
  label,
  id,
  onChange,
  checked,
}) => {
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
    </div>
  );
};
