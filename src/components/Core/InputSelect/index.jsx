import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import ArrowIcon from '../../Icons/ArrowIcon';
import BootstrapInput from './SelectBootstrapInput';

export default ({
  id,
  name,
  onChange,
  value,
  options,
}) => (
  <NativeSelect
    id={id}
    value={value}
    onChange={onChange}
    inputProps={{ name }}
    IconComponent={ArrowIcon}
    input={<BootstrapInput />}
  >
    {
      options.map((option) => (
        <option value={option.value}>
          {option.label}
        </option>
      ))
    }
  </NativeSelect>
);
