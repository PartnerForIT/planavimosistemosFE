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

export default function LoginIcon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 16 18' className={classes.root}>
      <g id='noun_854949_cc' transform='translate(-18.423 -14.018)'>
        <path
          id='Контур_1081'
          data-name='Контур 1081'
          d='M26.423,24.359c2.559,0,4.641-2.451,4.641-5.464a4.647,4.647,0,1,0-9.283,0C21.781,21.908,23.863,24.359,26.423,24.359Zm0-8.815a3.058,3.058,0,0,1,3.1,3.35c0,2.171-1.389,3.938-3.1,3.938s-3.1-1.767-3.1-3.938A3.058,3.058,0,0,1,26.423,15.544Zm.475,9.323h-.95c-4.5,0-7.525,2.568-7.525,6.388a.773.773,0,0,0,1.546,0c0-3.589,3.221-4.862,5.979-4.862h.95c2.758,0,5.98,1.273,5.98,4.862a.773.773,0,0,0,1.545,0C34.423,27.434,31.4,24.867,26.9,24.867Z'
          fill='#808f94'
        />
      </g>
    </SvgIcon>
  );
}
