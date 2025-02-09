/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles({
  root: {
    width: '2em',
    height: '2em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
});


export default function UserIcon({ photo, className }) {
  const classes = useStyles();

  return (
    <div >
      {
        photo ? (
          <img
            alt=''
            className={classnames(classes.root, className)}
            src={photo}
          />
        ) :
        (
          <SvgIcon viewBox='0 0 17.93 17.93' className={className}>
            <path
              id='Контур_13289'
              data-name='Контур 13289'
              d='M10.538,2.619A9.026,9.026,0,0,0,19.5-6.346a9.039,9.039,0,0,0-8.974-8.965A9.029,9.029,0,0,0,1.573-6.346,9.031,9.031,0,0,0,10.538,2.619Zm0-14.027a3.138,3.138,0,0,1,3.015,3.252,3.113,3.113,0,0,1-3.015,3.313A3.134,3.134,0,0,1,7.523-8.156,3.133,3.133,0,0,1,10.538-11.408ZM15.882-1.143l.026.114a7.417,7.417,0,0,1-5.37,2.268,7.417,7.417,0,0,1-5.37-2.268l.026-.114a6.622,6.622,0,0,1,5.344-2.206A6.609,6.609,0,0,1,15.882-1.143Z'
              transform='translate(-1.573 15.311)'
              fill='#8f9091'
            />
          </SvgIcon>
        )
      }
    </div>
  );
}
