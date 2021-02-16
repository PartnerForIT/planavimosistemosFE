import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '2em',
    height: '2em',
  },
});

export default function CheckStatus({ fill }) {
  const classes = useStyles();
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
