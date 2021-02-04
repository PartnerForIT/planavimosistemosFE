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

export default function ArrowBack() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 24 18' className={classes.root}>
      <path
        id='Контур_1083'
        data-name='Контур 1083'
        d='M21.311,991.218l6.62,7.714a1.239,1.239,0,0,0,1.763.115,1.352,1.352,0,0,0,.086-1.829L25,991.647H43.759a1.286,1.286,0,0,0,0-2.571H25l4.784-5.571a1.35,1.35,0,0,0-.1-1.828,1.225,1.225,0,0,0-1.751.114l-6.62,7.714a1.334,1.334,0,0,0,0,1.714Z'
        transform='translate(-21 -981.361)'
        fill='#fff'
      />
    </SvgIcon>
  );
}
