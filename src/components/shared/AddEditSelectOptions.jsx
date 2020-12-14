import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import style from '../Core/Dialog/Dialog.module.scss';
import BootstrapInput from './SelectBootstrapInput';

const AddEditSelectOptions = ({
  id, user, name, options, handleInput, ...rest
}) => (
  <NativeSelect
    className={style.select}
    id={id}
    value={user[name] ?? ''}
    onChange={handleInput}
    fullWidth
    inputProps={{
      name,
    }}
    input={<BootstrapInput />}
    {...rest}
  >
    {
        options.map((opt) => (
          <option value={opt.id} key={opt.id + opt.name}>{opt.name}</option>
        ))
      }
  </NativeSelect>
);

export default AddEditSelectOptions;
