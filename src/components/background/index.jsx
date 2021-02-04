import React from 'react';
import classes from './styles.module.scss';

const BackgroundWrapper = ({ children }) => (
  <div className={classes.root}>
    {children}
  </div>
);
export default BackgroundWrapper;
