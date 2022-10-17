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

export default function TimeSheetIcon({ viewBox, fill }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox={viewBox || '0 0 20.851 26.406'} className={viewBox ? classes.root1 : classes.root2}>
      <g id="Component_4_1" data-name="Component 4 – 1" transform="translate(0 0.3)">
        <path id="Subtraction_15" data-name="Subtraction 15" strokeWidth="0.6px;" fill={fill || '#808f94'} stroke={fill || '#808f94'} d="M-10743.03,3659.9h-10.69a4.31,4.31,0,0,1-4.278-4.332v-16.238a4.31,4.31,0,0,1,4.278-4.332h5.688c.906,0,2.479,1.17,4.813,3.575.2.2.41.422.64.655l.188.193.014.011c.681.7,1.453,1.486,2.217,2.284,0,.005.6.7,1.025,1.3a4.825,4.825,0,0,1,.415,2.067l-.035,10.482A4.308,4.308,0,0,1-10743.03,3659.9Zm-10.757-23.531c-2.129,0-3.207,1.1-3.207,3.277v15.6c0,2.182,1.078,3.289,3.207,3.289h10.826c2.127,0,3.206-1.107,3.206-3.289v-9.3h-7.455c-1.306,0-1.912-.616-1.912-1.938v-7.635Zm6.1.1v7.457a.5.5,0,0,0,.558.579h7.26a2.652,2.652,0,0,0-.874-1.383l-5.589-5.761a2.7,2.7,0,0,0-1.354-.892Zm3.245,17.869h-7.85a.714.714,0,0,1-.729-.73.709.709,0,0,1,.729-.719h7.85a.717.717,0,0,1,.731.719A.723.723,0,0,1-10744.446,3654.339Zm0-3.943h-7.85a.709.709,0,0,1-.729-.719.707.707,0,0,1,.729-.717h7.85a.708.708,0,0,1,.731.717A.717.717,0,0,1-10744.446,3650.4Z" transform="translate(10759.271 -3634.999)"/>
        <g id="Ellipse_8" data-name="Ellipse 8" strokeLinecap="round;" strokeLinejoin="round" fill="#fff" strokeWidth="1.5px;" stroke={fill || '#808f94'} transform="translate(0 13.106)">
          <circle stroke="none" cx="6.5" cy="6.5" r="6.5"/>
          <circle fill="none;" cx="6.5" cy="6.5" r="5.75"/>
        </g>
        <path id="Path_13770" data-name="Path 13770" stroke={fill || '#808f94'} fill="none" d="M1062-1812.111v2.6l1.683,1.683" transform="translate(-1055.459 1829.497)"/>
      </g>
    </SvgIcon>
  );
}