/* eslint-disable max-len */
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '32px',
    height: '32px',
  },
}));

export default function WorkTimeIcon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 32.19 32.19' className={classes.root}>
      <path
        id='13592'
        data-name='13592'
        d='M.008,4.765A16.2,16.2,0,0,0,16.1-11.339,16.212,16.212,0,0,0-.008-27.426,16.2,16.2,0,0,0-16.1-11.339,16.216,16.216,0,0,0,.008,4.765ZM-8.11-9.546a1.131,1.131,0,0,1-1.146-1.162A1.123,1.123,0,0,1-8.11-11.837h6.956v-9.347A1.137,1.137,0,0,1-.008-22.329a1.137,1.137,0,0,1,1.146,1.146v10.476A1.131,1.131,0,0,1-.008-9.546Z'
        transform='translate(16.095 27.426)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}
