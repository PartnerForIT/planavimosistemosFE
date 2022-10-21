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

export default function IntegrationsIcon({ viewBox, fill }) {
  const classes = useStyles();
  return ( <SvgIcon viewBox={viewBox ? viewBox : "0 0 19.483 19.392"} className={viewBox ? classes.root1 : classes.root2}>
    <path id="mindmap-svgrepo-com-2" data-name="mindmap-svgrepo-com" fill={ fill ? fill : "#69767a"} d="M17.741,10.148a1.56,1.56,0,0,0-1.279.669l-1.15-.2c0-.043,0-.086,0-.13a3.806,3.806,0,0,0-.284-1.444l1.948-1.176a1.562,1.562,0,1,0-.594-.974l-1.939,1.17A3.828,3.828,0,0,0,12.057,6.7V4.308a1.8,1.8,0,1,0-1.141,0V6.7A3.838,3.838,0,0,0,7.994,8.923l-3.57-1.1A2.222,2.222,0,1,0,4,8.888l3.691,1.134a3.8,3.8,0,0,0,1.038,3.113L7.118,14.846a1.892,1.892,0,1,0,.854.757l1.661-1.768a3.817,3.817,0,0,0,3.632.04l1.658,2.521a2.218,2.218,0,1,0,.989-.572L14.186,13.2a3.834,3.834,0,0,0,.917-1.459l1.093.189a1.56,1.56,0,1,0,1.545-1.78ZM8.8,10.487a2.687,2.687,0,1,1,2.687,2.687A2.69,2.69,0,0,1,8.8,10.487Z" transform="translate(0 -0.796)"/>
  </SvgIcon> );
}
