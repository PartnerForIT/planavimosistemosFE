import React from 'react';
// import {
//   withStyles,
// } from '@material-ui/core/styles';
// import * as _ from 'lodash';
// import InputBase from '@material-ui/core/InputBase';
// import NativeSelect from '@material-ui/core/NativeSelect';
import InputSelect from '../InputSelect';

// const BootstrapInput = withStyles((theme) => ({
//   root: {
//     'label + &': {
//       marginTop: theme.spacing(3),
//     },
//     '& label.Mui-focused': {
//       color: '#4d7499',
//     },
//   },
//   input: {
//     borderRadius: 4,
//     width: '100%',
//     position: 'relative',
//     backgroundColor: theme.palette.common.white,
//     border: '1px solid #e8eff6',
//     fontSize: 14,
//     lineHeight: '16px',
//     padding: '11px',
//     transition: theme.transitions.create(['border-color', 'box-shadow']),
//     '&:focus': {
//       boxShadow: 'none',
//       borderRadius: 4,
//       backgroundColor: theme.palette.common.white,
//       borderColor: '#0087ff',
//     },
//   },
// }))(InputBase);

// export default function SimpleSelect({
//   handleInputChange, name, value, options,
// }) {
//   return (
//     <NativeSelect
//       id='country-select'
//       value={value}
//       fullWidth
//       onChange={handleInputChange}
//       inputProps={{
//         name: `${name}`,
//       }}
//       input={<BootstrapInput name='country' />}
//     >
//       {_.map(options, (item) => (
//         <option
//           key={(item.code || item.id) + (item.name || item.label)}
//           value={item.code || item.id}
//         >
//           {item.name || item.label}
//         </option>
//       ))}
//     </NativeSelect>
//   );
// }

export default ({
  value,
  handleInputChange,
  options,
  valueKey = 'code',
  labelKey = 'name',
  placeholder,
  name,
  readOnly,
}) => (
  <InputSelect
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={handleInputChange}
    options={options}
    valueKey={valueKey}
    labelKey={labelKey}
    disabled={readOnly}
  />
);
