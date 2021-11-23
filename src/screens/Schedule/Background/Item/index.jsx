import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import classes from './Item.module.scss';

export default ({
  currentDay,
  dayGoneBy,
}) => {
  const { t } = useTranslation();
  const itemClasses = classNames(classes.item, {
    [classes.item_currentDay]: currentDay,
    [classes.item_dayGoneBy]: dayGoneBy,
  });

  return (
    <div className={itemClasses} />
  );
};
