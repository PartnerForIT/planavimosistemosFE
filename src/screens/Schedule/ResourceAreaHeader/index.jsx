import React from 'react';

import classes from './ResourceAreaHeader.module.scss';

export default ({
  title,
  onClickPrev,
  onClickNext,
}) => (
  <div className={classes.resourceAreaHeader}>
    <button
      className={classes.resourceAreaHeader__buttonLeft}
      aria-label='prev'
      onClick={onClickPrev}
    />
    {title}
    <button
      className={classes.resourceAreaHeader__buttonRight}
      aria-label='next'
      onClick={onClickNext}
    />
  </div>
);
