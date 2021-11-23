import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import classes from './ShiftColor.module.scss';

export default ({
  label,
  modalLabel,
  value,
  colors,
  onChange,
}) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpenModal = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleOnClickAway = () => {
    setIsOpen(false);
  };
  const handleChange = (color) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleOnClickAway}>
      <div className={classes.shiftColor}>
        {
          label && (
            <span className={classes.shiftColor__label}>
              {label}
            </span>
          )
        }
        <button
          className={classes.shiftColor__button}
          style={{ backgroundColor: value }}
          onClick={handleClickOpenModal}
          aria-label='color'
        />
        {
          isOpen && (
            <div className={classes.shiftColor__modal}>
              <div className={classes.shiftColor__modal__title}>
                {t('Change Color')}
              </div>
              <div className={classes.shiftColor__modal__subTitel}>
                {modalLabel}
              </div>
              <div className={classes.shiftColor__modal__label}>
                {t('Bright')}
              </div>
              <div className={classes.shiftColor__modal__colors}>
                {colors.bright.map((item) => (
                  <button
                    className={classes.shiftColor__modal__colors__item}
                    style={{ backgroundColor: item }}
                    aria-label={item}
                    onClick={() => handleChange(item)}
                  />
                ))}
              </div>
              <div className={classes.shiftColor__modal__label}>
                {t('Calm')}
              </div>
              <div className={classes.shiftColor__modal__colors}>
                {colors.calm.map((item) => (
                  <button
                    className={classes.shiftColor__modal__colors__item}
                    style={{ backgroundColor: item }}
                    aria-label={item}
                    onClick={() => handleChange(item)}
                  />
                ))}
              </div>
            </div>
          )
        }
      </div>
    </ClickAwayListener>
  );
};
