/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import classnames from 'classnames';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '16px',
    height: '16px',
  },
}));

export default function RefreshArrow({ className }) {
  const classes = useStyles();
  return (
    <SvgIcon viewBox='0 0 16 16' className={classnames(classes.root, className)}>
      <g id="icon_-_recurring-2" data-name="icon - recurring" transform="translate(-1314 -186)">
        <circle id="Ellipse_17" data-name="Ellipse 17" cx="8" cy="8" r="8" transform="translate(1314 186)" fill="#fd9d27"/>
        <path id="Path_13795" data-name="Path 13795" d="M.635,3.4a2.609,2.609,0,0,1,.832-1.911l.486.5a.158.158,0,0,0,.082.044.156.156,0,0,0,.092-.01.16.16,0,0,0,.071-.06.165.165,0,0,0,.026-.09V.477A.159.159,0,0,0,2.065.315H.7A.161.161,0,0,0,.591.591l.426.439A3.272,3.272,0,0,0,2.465,6.57a.324.324,0,0,0,.394-.318.328.328,0,0,0-.251-.318A2.588,2.588,0,0,1,.635,3.4Zm5.718,0A3.24,3.24,0,0,0,3.888.233a.324.324,0,0,0-.394.318A.328.328,0,0,0,3.745.87a2.61,2.61,0,0,1,1.14,4.442l-.486-.5a.158.158,0,0,0-.082-.044.156.156,0,0,0-.092.01.16.16,0,0,0-.071.06.165.165,0,0,0-.026.09V6.327a.159.159,0,0,0,.159.162H5.651a.161.161,0,0,0,.111-.276l-.426-.439A3.262,3.262,0,0,0,6.353,3.4Z" transform="translate(1318.823 190.598)" fill="#fff"/>
      </g>
    </SvgIcon>
  );
}
