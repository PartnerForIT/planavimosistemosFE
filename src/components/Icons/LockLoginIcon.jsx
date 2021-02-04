/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '1em',
    height: '1em',
  },
}));

export default function LockLoginIcon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 16.4 18.4' className={classes.root}>
      <g id='lock' transform='translate(-2.595 -1.3)'>
        <path
          id='Контур_13757'
          data-name='Контур 13757'
          d='M2,0H13a2,2,0,0,1,2,2V8a2,2,0,0,1-2,2H2A2,2,0,0,1,0,8V2A2,2,0,0,1,2,0Z'
          transform='translate(3.295 9)'
          fill='none'
          stroke='#808f94'
          strokeLinecap='round'
          strokeWidth='1.4'
        />
        <path
          id='Контур_13756'
          data-name='Контур 13756'
          d='M7,8.946v-2.9A4.151,4.151,0,0,1,11.249,2,4.151,4.151,0,0,1,15.5,6.046v2.9'
          transform='translate(-0.665 0)'
          fill='none'
          stroke='#808f94'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='1.4'
        />
      </g>
    </SvgIcon>
  );
}
