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

export default function CheckedLanguage({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 24 24' className={classnames(classes.root, className)}>
      <g id='Info' transform='translate(0.012 0.012)'>
        <rect id='Frame' width='24' height='24' transform='translate(-0.012 -0.012)' fill='#007aff' opacity='0' />
        <path id='Symbol' d='M-4.347-5.173a.719.719,0,0,0,.633-.33L.52-12.034a.809.809,0,0,0,.154-.452.621.621,0,0,0-.651-.638.608.608,0,0,0-.579.344L-4.365-6.756-6.31-9.207a.648.648,0,0,0-.538-.271.631.631,0,0,0-.66.647.707.707,0,0,0,.194.479L-4.975-5.48A.762.762,0,0,0-4.347-5.173Z' transform='translate(15.405 21.23)' fill='#0a84ff' />
      </g>
    </SvgIcon>
  );
}
