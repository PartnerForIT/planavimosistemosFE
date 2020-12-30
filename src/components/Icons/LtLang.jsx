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

export default function LtLang({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 21 14' className={classnames(classes.root, className)}>
      <defs>
        <pattern id='pattern' preserveAspectRatio='xMidYMid slice' width='100%' height='100%' viewBox='0 0 450 300'>
          <image width='450' height='300' xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcIAAAEsAgMAAAAtOFskAAAACVBMVEX9uRMAakTBJy2z1jQzAAAAfElEQVR4Ae3NMQ0AIBAEMCSy4I8ZlWi45HNTa6ALAAAAAAAAAAAAACB1yrbRaDQOMxqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0fjKrjFlNBqNRqPRaDQajUaj0Wg0Go1Go9FoNBqNRqPRaDQajUaj0Wg0Gj+CGBoVNfIavQAAAABJRU5ErkJggg==' />
        </pattern>
      </defs>
      <g id='ltu' transform='translate(-1157 -178)'>
        <g id='lithuania' transform='translate(1157 178)' stroke='#808f94' strokeWidth='1' fill='url(#pattern)'>
          <rect width='21' height='14' rx='2' stroke='none' />
          <rect x='0.5' y='0.5' width='20' height='13' rx='1.5' fill='none' />
        </g>
      </g>
    </SvgIcon>
  );
}
