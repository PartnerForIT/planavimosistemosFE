/* eslint-disable max-len */
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '1.5em',
    height: '1.5em',
  },
}));

export default function SecurityIcon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 21.167 30.796' className={classes.root}>
      <path
        id='Контур_13593'
        data-name='Контур 13593'
        d='M-7.512,3.619H7.512c2.059,0,3.071-1.013,3.071-3.254v-11.6c0-2.009-.83-3.038-2.54-3.2v-3.935c0-5.927-3.918-8.8-8.035-8.8-4.134,0-8.052,2.872-8.052,8.8v4a2.832,2.832,0,0,0-2.54,3.138V.365C-10.583,2.606-9.571,3.619-7.512,3.619Zm2.158-22.312c0-3.852,2.457-5.91,5.362-5.91,2.889,0,5.346,2.059,5.346,5.91v4.217l-10.708.033Z'
        transform='translate(10.583 27.177)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}
