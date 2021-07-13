import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Checkbox from '../../../../Core/Checkbox/Checkbox';
import classes from './Header.module.scss';

export default ({
  onClickPrev,
  onClickNext,
  daysOfWeek,
  onChange,
  makeShiftFor,
  currentWeek,
}) => {
  const { t } = useTranslation();

  return (
    <div className={classes.header}>
      <div className={classes.header__resource}>
        <button
          className={classes.header__resource__prev}
          aria-label='prev'
          onClick={onClickPrev}
          disabled={currentWeek === 0}
        />
        {`${t('Week')} ${currentWeek + 1}/${makeShiftFor}`}
        <button
          className={classes.header__resource__next}
          aria-label='next'
          onClick={onClickNext}
          disabled={currentWeek === makeShiftFor}
        />
      </div>
      {
        daysOfWeek[currentWeek].map((item) => (
          <div
            key={`daysOfWeek-${item.id}`}
            className={classNames(classes.header__cell, {
              [classes.header__cell_checked]: !item.disabled && item.checked,
              [classes.header__cell_disabled]: item.disabled,
            })}
          >
            {item.label}
            <Checkbox
              name={`${item.id}`}
              checked={!item.disabled && item.checked}
              onChange={onChange}
            />
          </div>
        ))
      }
    </div>
  );
};
