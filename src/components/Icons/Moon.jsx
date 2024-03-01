/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '11px',
    height: '11px',
  },
}));

export default function Moon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 11 11' className={classes.root} fill="none">
      <path d="M5.54989 10.4127C4.86848 10.4127 4.22634 10.2824 3.62345 10.0218C3.02057 9.76126 2.49413 9.40598 2.04413 8.95599C1.59414 8.50599 1.23885 7.97955 0.978277 7.37666C0.717694 6.77378 0.587402 6.13164 0.587402 5.45023C0.587402 4.28036 0.950381 3.24687 1.67634 2.34976C2.40229 1.45266 3.33642 0.883268 4.47872 0.641602C4.41975 1.45249 4.50453 2.24528 4.73305 3.01995C4.96158 3.79464 5.36622 4.47236 5.94699 5.05313C6.52776 5.63389 7.20548 6.03854 7.98017 6.26706C8.75484 6.49559 9.54762 6.56787 10.3585 6.4839C10.122 7.63454 9.55387 8.57699 8.65419 9.31128C7.75452 10.0456 6.71976 10.4127 5.54989 10.4127V10.4127Z" fill="#DB894F"/>
    </SvgIcon>
  );
}
