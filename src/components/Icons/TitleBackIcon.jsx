/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root1: {
    width: '2em',
    height: '2em',
  },
  root2: {
    width: '11px',
    height: '13px',
    fill: 'none',
  },
}));

export default function TitleBackIcon({ viewBox }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox={viewBox || '0 0 11 13'} className={viewBox ? classes.root1 : classes.root2} fill="none">
      <path d="M9.33984 1L1.00183 6.70703L9.33984 11.4419" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </SvgIcon>
  );
}
