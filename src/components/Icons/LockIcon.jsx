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

export default function LockIcon({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 13.4 15.395' className={classnames(classes.root, className)}>
      <g id='lock' transform='translate(-2.596 -1.3)'>
        <rect id='Прямоугольник_71848' data-name='Прямоугольник 71848' width='12' height='8' rx='2' transform='translate(3.296 7.995)' fill='none' stroke='#808f94' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
        <path id='Контур_13756' data-name='Контур 13756' d='M7,8V5.331A3.417,3.417,0,0,1,10.5,2,3.417,3.417,0,0,1,14,5.331V8' transform='translate(-1.202)' fill='none' stroke='#808f94' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
      </g>
    </SvgIcon>
  );
}
