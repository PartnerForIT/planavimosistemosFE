import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import classes from './ShiftColor.module.scss';

export default ({
  label,
  modalLabel,
  value,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpenModal = () => {
    setIsOpen(true);
  };
  const handleOnClickAway = () => {
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
                {modalLabel}
              </div>
              <div className={classes.shiftColor__modal__label}>
                {modalLabel}
              </div>
            </div>
          )
        }
      </div>
    </ClickAwayListener>
  );
};
