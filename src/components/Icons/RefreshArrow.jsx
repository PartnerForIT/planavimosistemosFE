/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import classnames from 'classnames';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '1em',
    height: '1em',
  },
}));

export default function RefreshArrow({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 14 16' className={classnames(classes.root, className)}>
      <path
        id='Контур_1084'
        data-name='Контур 1084'
        d='M13.35,21.751a7.1,7.1,0,0,0-7.584-3.756l.805-1.47A.645.645,0,0,0,6.3,15.61a.681.681,0,0,0-.94.261L3.72,18.844s-.369.588.2.849l3.054,1.6a.66.66,0,0,0,.336.1.671.671,0,0,0,.6-.359.645.645,0,0,0-.268-.915l-1.577-.849a5.671,5.671,0,0,1,5.973,3.005,5.353,5.353,0,0,1-2.617,7.252,5.665,5.665,0,0,1-4.262.229,5.516,5.516,0,0,1-3.188-2.777,5.25,5.25,0,0,1-.235-4.148.688.688,0,0,0-.436-.882.8.8,0,0,0-.872.49,6.651,6.651,0,0,0,.3,5.194,6.954,6.954,0,0,0,3.993,3.5,7.181,7.181,0,0,0,2.315.392,6.916,6.916,0,0,0,3.02-.686A6.728,6.728,0,0,0,13.35,21.751Z'
        transform='translate(-0.043 -15.518)'
        fill='#fff'
      />
    </SvgIcon>
  );
}
