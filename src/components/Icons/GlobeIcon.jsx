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

export default function GlobeIcon({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 15.4 15.4' className={classnames(classes.root, className)}>
      <g id='globe' transform='translate(-1.098 -1.098)'>
        <circle id='Эллипс_153' data-name='Эллипс 153' cx='7' cy='7' r='7' transform='translate(1.798 1.798)' fill='none' stroke='#808f94' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
        <line id='Линия_640' data-name='Линия 640' x2='14' transform='translate(1.798 8.798)' fill='none' stroke='#808f94' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
        <path id='Контур_13760' data-name='Контур 13760' d='M10.719,2a10.4,10.4,0,0,1,2.719,6.8,10.4,10.4,0,0,1-2.719,6.8A10.4,10.4,0,0,1,8,8.8,10.4,10.4,0,0,1,10.719,2Z' transform='translate(-1.921)' fill='none' stroke='#808f94' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.4' />
      </g>
    </SvgIcon>
  );
}
