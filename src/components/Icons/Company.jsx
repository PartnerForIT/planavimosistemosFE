/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '1.5em',
    height: '1.5em',
  },
}));

export default function CompanyIcon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 34.83 30.314' className={classes.root}>
      <path
        id='Контур_13591'
        data-name='Контур 13591'
        d='M-6.79-22.263a1.685,1.685,0,0,1,1.909-1.893H4.881A1.685,1.685,0,0,1,6.79-22.263v1.428H-6.79Zm24.205,6.126c0-3.1-1.66-4.7-4.765-4.7H9.38v-1.229c0-3.1-1.561-4.5-4.516-4.5H-4.864c-2.822,0-4.532,1.395-4.532,4.5v1.229H-12.65c-2.955,0-4.765,1.594-4.765,4.7v4.018h34.83ZM-12.65,3.752h25.3c3.1,0,4.765-1.577,4.765-4.682v-9H6.309V-9A1.913,1.913,0,0,1,4.2-6.923H-4.267A1.9,1.9,0,0,1-6.358-9v-.93H-17.415v9C-17.415,2.175-15.755,3.752-12.65,3.752Z'
        transform='translate(17.415 26.563)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}
