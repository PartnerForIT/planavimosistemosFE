import React from 'react';
import {
  makeStyles,
} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles(() => ({
  label: {
    color: '#808F94',
    position: 'relative',
    paddingBottom: '12px',
    fontSize: 14,
    fontWeight: 500,
    transform: 'translate(0, 1.5px) scale(1)',
  },
}));

export default function Label({ text, htmlFor, className }) {
  const classes = useStyles();
  return (
    <InputLabel shrink htmlFor={htmlFor} className={`${classes.label} ${className || ''}`}>
      {text}
    </InputLabel>
  );
}
