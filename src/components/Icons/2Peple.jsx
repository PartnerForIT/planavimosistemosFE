/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '2em',
    height: '2em',
  },
}));

export default function PeopleIcon() {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 42.865 28.289' className={classes.root}>
      <path
        id='Контур_13571'
        data-name='Контур 13571'
        d='M8.218-11.488c3.387,0,6.292-3.038,6.292-6.956a6.533,6.533,0,0,0-6.292-6.773,6.587,6.587,0,0,0-6.309,6.807C1.909-14.526,4.814-11.488,8.218-11.488Zm-18.112.365A5.817,5.817,0,0,0-4.416-17.2a5.666,5.666,0,0,0-5.479-5.877,5.73,5.73,0,0,0-5.5,5.91A5.81,5.81,0,0,0-9.895-11.123ZM-18.61,3.071H-6.74C-8.4.7-6.458-4.067-3.021-6.724a12.107,12.107,0,0,0-6.89-2.009C-16.967-8.732-21.433-3.52-21.433.8-21.433,2.258-20.652,3.071-18.61,3.071Zm16.967,0H18.046c2.507,0,3.387-.73,3.387-2.125,0-4.051-5.08-9.629-13.231-9.629C.066-8.683-5.03-3.1-5.03.946-5.03,2.341-4.15,3.071-1.644,3.071Z'
        transform='translate(21.433 25.218)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}
