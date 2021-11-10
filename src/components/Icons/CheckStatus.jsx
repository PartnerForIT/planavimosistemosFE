import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '2em',
    height: '2em',
    paddingTop:'2px'
  },
});

export default function CheckStatus({ fill, blocked = false }) {
  const classes = useStyles();
  if (blocked) {
    return (
      <div>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' className={classes.root}>
          <path fill='#f44336' d='M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z' />
          <path fill='#fff' d='M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z' />
          <path fill='#fff' d='M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z' />
        </svg>
      </div>
    );
  }
  return (
    <SvgIcon viewBox='0 0 16 16' className={classes.root}>
      <g id='2383' data-name='2383' transform='translate(-47 -243)'>
        <g
          id='135'
          data-name='135'
          transform='translate(47 243)'
          fill={fill || '#57d05a'}
          stroke='#fff'
          strokeWidth='1'
        >
          <circle cx='8' cy='8' r='8' stroke='none' />
          <circle cx='8' cy='8' r='7.5' fill='none' />
        </g>
        <path
          id='Контур_13448'
          data-name='Контур 13448'
          d='M14625.123,9232.507l2.775,3.665,3.886-5.131'
          transform='translate(-14573.78 -8982.273)'
          fill='none'
          stroke='#fff'
          strokeLinejoin='round'
          strokeWidth='1'
        />
      </g>
    </SvgIcon>
  );
}
