import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RefreshArrows from '../../../../components/Icons/RefreshArrows';
import UserIcon from '../../../../components/Icons/UserIcon';
import Button from '../../../../components/Core/Button/Button';
import Content from '../../Dropdown/Content';
import classes from './ReplacedEmployee.module.scss';

export default ({
  newEmployee,
  oldEmployee,
  onDelete,
  onChangeEmployee,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleChangeEmployee = () => {
    onChangeEmployee();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOuterDropdownClick = (e) => {
      if (dropdownRef && dropdownRef.current
          && ((dropdownRef.current.contains(e.target)
              || (buttonRef.current && buttonRef.current.contains(e.target))))
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOuterDropdownClick, false);

    return () => {
      document.removeEventListener('mousedown', handleOuterDropdownClick, false);
    };
  }, []);

  return (
    <>
      <button
        className={classes.replacedEmployee__button}
        onClick={handleClick}
        ref={buttonRef}
      >
        <RefreshArrows />
      </button>
      {
        isOpen && (
          <Content
            onClose={handleCloseModal}
            wrapperRef={dropdownRef}
            offset={buttonRef.current.getBoundingClientRect()}
            maxHeight={280}
          >
            <div className={classes.replacedEmployee__user}>
              {
                oldEmployee.photo ? (
                  <img
                    alt='avatar'
                    className={classes.replacedEmployee__user__avatar}
                    src={oldEmployee.photo}
                  />
                ) : (
                  <UserIcon
                    className={classes.replacedEmployee__user__avatar}
                  />
                )
              }
              <div className={classes.replacedEmployee__user__info}>
                <div className={classes.replacedEmployee__user__info__fullName}>
                  {oldEmployee.name}
                </div>
                <div className={classes.replacedEmployee__user__info__bottom}>
                  {oldEmployee.job_type && `${oldEmployee.job_type} · `}
                  {/*<span className={classes.replacedEmployee__user__info__bottom__status}>*/}
                  {/*  Change*/}
                  {/*</span>*/}
                </div>
              </div>
            </div>
            <div className={`${classes.replacedEmployee__user} ${classes.replacedEmployee__user_change}`}>
              <div className={classes.replacedEmployee__user__icon}>
                <RefreshArrows />
              </div>
              {
                newEmployee.photo ? (
                  <img
                    alt='avatar'
                    className={classes.replacedEmployee__user__avatar}
                    src={newEmployee.photo}
                  />
                ) : (
                  <UserIcon
                    className={classes.replacedEmployee__user__avatar}
                  />
                )
              }
              <div className={classes.replacedEmployee__user__info}>
                <div className={classes.replacedEmployee__user__info__fullName}>
                  {newEmployee.name}
                </div>
                <div className={classes.replacedEmployee__user__info__bottom}>
                  {newEmployee.job_type && `${newEmployee.job_type} · `}
                  <span className={classes.replacedEmployee__user__info__bottom__status}>
                    Change
                  </span>
                </div>
              </div>
            </div>
            <Button
              className={classes.replacedEmployee__changeEmployee}
              onClick={handleChangeEmployee}
            >
              {t('Change Employee')}
            </Button>
            <Button
              className={classes.replacedEmployee__deleteTimeline}
              onClick={onDelete}
              cancel
            >
              {t('Delete Timeline')}
            </Button>
            <div className={classes.replacedEmployee__space} />
          </Content>
        )
      }
    </>
  );
};
