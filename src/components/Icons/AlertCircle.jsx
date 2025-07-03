import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

const AlertCircle = ({ className }) => (
  <SvgIcon viewBox='0 0 20 20' className={className}>
    <circle cx="10" cy="10" r="10" fill="#4080FC"/>
    <path d="M9.34375 11.7119L9.23438 5.13574H10.7588L10.6494 11.7119H9.34375ZM9.99316 15.0752C9.49414 15.0752 9.09766 14.6855 9.09766 14.1865C9.09766 13.6875 9.49414 13.3047 9.99316 13.3047C10.5059 13.3047 10.8955 13.6875 10.8955 14.1865C10.8955 14.6855 10.5059 15.0752 9.99316 15.0752Z" fill="#DFEEFB"/>
  </SvgIcon>
);

export default AlertCircle;
