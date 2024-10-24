import React from 'react';
import classNames from 'classnames';

import classes from './Item.module.scss';

export default ({
  currentDay,
  dayGoneBy,
}) => {
  const itemClasses = classNames(classes.item, {
    [classes.item_currentDay]: currentDay,
    [classes.item_dayGoneBy]: dayGoneBy,
  });

  return (
    <div className={itemClasses} />
  );
};
