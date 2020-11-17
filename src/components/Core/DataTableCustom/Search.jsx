import React from 'react';
import {
  withStyles,
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';


const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(0),
    },
    '& label.Mui-focused': {
      color: '#4d7499',
    },
  },
  input: {
    borderRadius: 4,
    width: '100%',
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e8eff6',
    fontSize: 14,
    lineHeight: '15px',
    padding: '6px',
    color: "#222",
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: 'none',
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      borderColor: '#0087ff',
    },
  },
}))(InputBase); 

export default function RowSearch({handleInputChange, inputValues}) {
  return (
    <BootstrapInput 
      name="name" 
      onChange={handleInputChange} 
      value={inputValues}
      inputProps={{
        autoComplete: 'new-password',
        form: {
          autoComplete: 'off',
        },
      }}
      placeholder="Search" 
      id="name" />
  )
}

