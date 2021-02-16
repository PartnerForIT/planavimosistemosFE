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
    <SvgIcon viewBox='0 0 26.612 33.784' className={classes.root}>
      <path
        id='13580'
        data-name='13580'
        d='M-8.359,5.578H8.359c3.271,0,4.947-1.693,4.947-5.014V-13.613H1.8c-2.009,0-2.955-.946-2.955-2.955V-28.206H-8.359c-3.271,0-4.947,1.693-4.947,5V.564C-13.306,3.9-11.629,5.578-8.359,5.578ZM1.917-15.8H13.124a4.143,4.143,0,0,0-1.345-2.108L3.146-26.7a4.2,4.2,0,0,0-2.092-1.361v11.372A.77.77,0,0,0,1.917-15.8ZM-6.051-6.823a1.092,1.092,0,0,1-1.129-1.1,1.082,1.082,0,0,1,1.129-1.1H6.068A1.092,1.092,0,0,1,7.2-7.919a1.1,1.1,0,0,1-1.129,1.1Zm0,6.01A1.1,1.1,0,0,1-7.18-1.926a1.092,1.092,0,0,1,1.129-1.1H6.068A1.1,1.1,0,0,1,7.2-1.926,1.106,1.106,0,0,1,6.068-.813Z'
        transform='translate(13.306 28.206)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}
