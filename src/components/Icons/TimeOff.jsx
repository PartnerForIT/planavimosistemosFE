/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root1: {
    width: '2em',
    height: '2em',
  },
  root2: {
    width: '1em',
    height: '1em',
  },
}));

export default function CategoriesIcon({ viewBox, fill }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox={viewBox || '0 0 25 23'} className={viewBox ? classes.root1 : classes.root2}>
        <path d="M24.6613 11.5002C24.6613 12.7227 22.9991 13.8595 20.8329 13.8595H16.4791C15.9 13.8595 15.6962 13.9774 15.3424 14.342L8.28614 21.7843C8.06094 22.0202 7.79284 22.1489 7.49258 22.1489H5.89474C5.62665 22.1489 5.46579 21.9023 5.6052 21.6235L9.262 13.8809L3.94302 13.3126L2.04492 16.5082C1.89479 16.7656 1.65886 16.8836 1.34788 16.8836H0.854583C0.554318 16.8836 0.339844 16.6691 0.339844 16.3795V6.62094C0.339844 6.33139 0.554318 6.11692 0.854583 6.11692H1.34788C1.65886 6.11692 1.89479 6.23488 2.04492 6.49225L3.94302 9.68793L9.262 9.11957L5.6052 1.37703C5.46579 1.09821 5.62665 0.851562 5.89474 0.851562H7.49258C7.79284 0.851562 8.06094 0.969523 8.28614 1.21617L15.3424 8.64772C15.6962 9.02305 15.9 9.14102 16.4791 9.14102H20.8329C22.9991 9.14102 24.6613 10.2777 24.6613 11.5002Z" fill={fill || '#808f94'}/>
      {/* #0085FF */}
    </SvgIcon>
  );
}
