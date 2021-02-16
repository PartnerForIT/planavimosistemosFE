import classnames from 'classnames';
import React from 'react';
import classes from './styles.module.scss';

const Card = ({ children, className }) => (
  <div className={classnames(classes.root, className)}>
    {children}
  </div>
);

export default Card;
