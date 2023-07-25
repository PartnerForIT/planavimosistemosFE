/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(() => ({
  root: {
    width: '16px',
    height: '16px',
    margin: '0 5px',
  },
}));

export default function WarningCircleIcon({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon width="16" height="16" viewBox="0 0 16 16" className={classnames(classes.root, className)}>
      <defs>
        <clipPath id="clip-path">
          <rect id="Rectangle_70936" data-name="Rectangle 70936" width="13.568" height="13.568" fill="#ffac00"/>
        </clipPath>
      </defs>
      <g id="Group_2449" data-name="Group 2449" transform="translate(-47 -422)">
        <g id="Group_1639" data-name="Group 1639" transform="translate(0 60)">
          <g id="Ellipse_30" data-name="Ellipse 30" transform="translate(47 362)" fill="#fff" stroke="#fafbfc" stroke-width="1">
            <circle cx="8" cy="8" r="8" stroke="none"/>
            <circle cx="8" cy="8" r="7.5" fill="none"/>
          </g>
        </g>
        <g id="Group_1648" data-name="Group 1648" transform="translate(48.192 423.192)">
          <g id="Group_1643" data-name="Group 1643" transform="translate(0 0)" clip-path="url(#clip-path)">
            <path id="Subtraction_1" data-name="Subtraction 1" d="M0,6.786A6.829,6.829,0,0,1,6.779,0a6.845,6.845,0,0,1,6.79,6.785A6.835,6.835,0,0,1,6.786,13.57,6.83,6.83,0,0,1,0,6.786" transform="translate(-0.001 -0.002)" fill="#ffac00" stroke="rgba(0,0,0,0)" stroke-miterlimit="10" stroke-width="1"/>
          </g>
        </g>
      </g>
      <text id="_" data-name="!" transform="translate(6.7 12)" fill="#fff" font-size="10" font-family="HelveticaNeue-Medium, Helvetica Neue" font-weight="500"><tspan x="0" y="0">!</tspan></text>
    </SvgIcon>
  );
}
