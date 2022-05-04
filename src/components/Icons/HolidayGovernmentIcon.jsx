/* eslint-disable max-len */
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles(() => ({
  root: {
    width: '16px',
    height: '16px',
  },
}));

const HolidayGovernmentIcon = ({ className }) => {
  const classes = useStyles();

  return (
    <SvgIcon width="16px" height="16px" viewBox="0 0 16 16" className={classnames(classes.root, className)} data-name='help-icon'>
      <circle id="Ellipse_26" fill="#40c3e2" data-name="Ellipse 26" cx="8" cy="8" r="8"/>
      <path id="Path_13774" fill="#fff" fillRule="evenodd" data-name="Path 13774" d="M9.942,1.262C9.931,1.246,8.828-.229,7.4.419A2.026,2.026,0,0,0,6.191,1.795a1.9,1.9,0,0,0-1.266-.738C3.384.782,2.457,2.491,2.448,2.508a.062.062,0,0,0,.014.076.063.063,0,0,0,.077,0A2.608,2.608,0,0,1,4.415,2.3l.221.04a3.223,3.223,0,0,0-1.179.973A3.48,3.48,0,0,0,3.314,6.9a.093.093,0,0,0,.171-.021h0a7.555,7.555,0,0,1,1.33-2.515,12.931,12.931,0,0,1,1.047-1.1c.042.163.085.356.123.578h0c.021.122.041.252.059.391h0c.025.194.045.406.06.634h0q.013.193.018.4h0c0,.017,0,.034,0,.05h0c0,.033,0,.067,0,.1A3.61,3.61,0,0,1,6.1,5.91c-.018.149-.045.3-.077.445q-.068.312-.167.615-.075.231-.163.457c-.086.222-.172.421-.246.587-.035.078-.068.15-.1.212h0a1.684,1.684,0,0,0-.12.29c0,.122.087.35.7.5.951.238,1.043-.154,1.043-.154A4.979,4.979,0,0,0,7.1,8.32h0c.035-.179.072-.4.105-.666h0q.03-.239.055-.526h0q.01-.118.019-.243.033-.482.036-.966h0c0-.024,0-.048,0-.072s0-.073,0-.111c0-.159-.007-.314-.018-.466q-.019-.29-.061-.578a7.653,7.653,0,0,0-.469-1.723q-.025-.061-.048-.115a5.244,5.244,0,0,1,1.365.518,4.748,4.748,0,0,1,1.8,1.868h0a.093.093,0,0,0,.094.053.094.094,0,0,0,.081-.071,2.9,2.9,0,0,0-1.3-3.132,2.672,2.672,0,0,0-1.15-.331,3.05,3.05,0,0,1,.428-.242,2.348,2.348,0,0,1,1.821-.161.063.063,0,0,0,.074-.017.061.061,0,0,0,0-.076Z" transform="translate(1.716 3.325)"/>
    </SvgIcon>
  );
}

export default HolidayGovernmentIcon;
