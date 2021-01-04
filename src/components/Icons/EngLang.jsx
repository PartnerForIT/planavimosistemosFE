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

export default function EngLang({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 21 14.86' className={classnames(classes.root, className)}>
      <g id='eng' transform='translate(-1157 -151.752)'>
        <g id='Flag_of_Great_Britain__1707_1800_' data-name='Flag_of_Great_Britain_(1707–1800)' transform='translate(1157 152.4)'>
          <rect id='Прямоугольник_72042' data-name='Прямоугольник 72042' width='19' height='12' transform='translate(1 0.6)' fill='#00247d' />
          <path id='Контур_13762' data-name='Контур 13762' d='M0,0,19.057,12.342M19.057,0,0,12.342' transform='translate(0.971 0.611)' stroke='#fff' strokeWidth='3' />
          <path id='Контур_13763' data-name='Контур 13763' d='M10.5,0V13.6M0,6.8H21' stroke='#fff' strokeWidth='5' />
          <path id='Контур_13764' data-name='Контур 13764' d='M10.5,0V13.6M0,6.8H21' stroke='#cf142b' strokeWidth='3' />
        </g>
        <g id='Прямоугольник_72043' data-name='Прямоугольник 72043' transform='translate(1157 152)' fill='none' stroke='#808f94' strokeWidth='1'>
          <rect width='21' height='14' rx='2' stroke='none' />
          <rect x='0.5' y='0.5' width='20' height='13' rx='1.5' fill='none' />
        </g>
      </g>
    </SvgIcon>
  );
}
