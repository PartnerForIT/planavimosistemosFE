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

export default function SuccessIcon({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 19 14' className={classnames(classes.root, className)}>
      <path
        id='Контур_1086'
        data-name='Контур 1086'
        d='M7.783,18.784a.777.777,0,0,0,1.075,0L21.777,6.258a.72.72,0,0,0,0-1.042.776.776,0,0,0-1.075,0L8.32,17.221,4.3,13.321a.776.776,0,0,0-1.075,0,.72.72,0,0,0,0,1.042Z'
        transform='translate(-3 -5)'
        fill='#fff'
      />

    </SvgIcon>
  );
}
