import React from 'react';
// import NativeSelect from '@material-ui/core/NativeSelect';
// import style from '../Core/Dialog/Dialog.module.scss';
// import BootstrapInput from './SelectBootstrapInput';
import InputSelect from '../Core/InputSelect';

const AddEditSelectOptions = ({
  valueKey = 'id',
  labelKey = 'name',
  placeholder,
  disabled,
  id, user, name, options, handleInput, ...rest
}) => (
  <InputSelect
    name={name}
    placeholder={placeholder}
    value={user[name]}
    onChange={handleInput}
    options={options}
    valueKey={valueKey}
    labelKey={labelKey}
    disabled={disabled}
    {...rest}
  />
);

export default AddEditSelectOptions;
