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
    <SvgIcon viewBox='0 0 59.284 28.289' className={classes.root}>
      <path
        id='Контур_13575'
        data-name='Контур 13575'
        d='M.008-11.488c3.387,0,6.292-3.038,6.292-6.956A6.533,6.533,0,0,0,.008-25.218,6.587,6.587,0,0,0-6.3-18.411C-6.3-14.526-3.4-11.488.008-11.488Zm-18.112.365A5.817,5.817,0,0,0-12.625-17.2,5.666,5.666,0,0,0-18.1-23.076a5.73,5.73,0,0,0-5.5,5.91A5.81,5.81,0,0,0-18.1-11.123Zm36.208,0a5.81,5.81,0,0,0,5.5-6.043,5.73,5.73,0,0,0-5.5-5.91A5.676,5.676,0,0,0,12.625-17.2,5.817,5.817,0,0,0,18.1-11.123ZM-26.82,3.071h11.87c-1.66-2.374.282-7.139,3.719-9.795a12.107,12.107,0,0,0-6.89-2.009C-25.176-8.732-29.642-3.52-29.642.8-29.642,2.258-28.862,3.071-26.82,3.071Zm53.64,0c2.042,0,2.822-.813,2.822-2.274,0-4.316-4.466-9.529-11.521-9.529a12.107,12.107,0,0,0-6.89,2.009C14.667-4.067,16.61.7,14.95,3.071Zm-36.673,0H9.836c2.507,0,3.387-.73,3.387-2.125,0-4.051-5.08-9.629-13.231-9.629C-8.143-8.683-13.24-3.1-13.24.946-13.24,2.341-12.36,3.071-9.853,3.071Z'
        transform='translate(29.642 25.218)'
        fill='rgba(226,235,244,0.85)'
      />
    </SvgIcon>
  );
}
