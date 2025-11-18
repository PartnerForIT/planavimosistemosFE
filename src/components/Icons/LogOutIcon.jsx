/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(() => ({
  root: {
    width: '1em',
    height: '1em',
  },
}));

export default function LogOutIcon({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 14.401 14.401' className={classnames(classes.root, className)}>
      <g id='log-out' transform='translate(-2.3 -2.3)'>
        <path id='Контур_13758' data-name='Контур 13758' d='M7.334,16H4.445A1.445,1.445,0,0,1,3,14.556V4.445A1.445,1.445,0,0,1,4.445,3H7.334' transform='translate(0 0)' fill='none' stroke='#FFBF23' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
        <path id='Контур_13759' data-name='Контур 13759' d='M16,14.223l3.611-3.611L16,7' transform='translate(-3.61 -1.111)' fill='none' stroke='#FFBF23' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
        <line id='Линия_630' data-name='Линия 630' x1='8' transform='translate(7.5 9.5)' fill='none' stroke='#FFBF23' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
      </g>
    </SvgIcon>
  );
}
