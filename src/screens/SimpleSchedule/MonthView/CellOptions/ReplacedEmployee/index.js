import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import RefreshArrows from '../../../../../components/Icons/RefreshArrows';
import Button from '../../../../../components/Core/Button/Button';
import Content from '../../../Dropdown/Content';
import classes from './ReplacedEmployee.module.scss';
import SchedudlePlaceholderAvatarIcon from "../../../../../components/Icons/SchedudlePlaceholderAvatar";

export default ({
  newEmployee,
  oldEmployee,
  onDelete,
  onChangeEmployee,
  isShown,
  setIsOpen,
  isToday
}) => {
  const { t } = useTranslation();
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

    // eslint-disable-next-line
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
          isShown && (
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
                        <SchedudlePlaceholderAvatarIcon/>
                    )
                  }
                  <div className={classes.replacedEmployee__user__info}>
                    <div className={classes.replacedEmployee__user__info__fullName}>
                      {oldEmployee.name}
                    </div>
                    <div className={classes.replacedEmployee__user__info__bottom}>
                      {oldEmployee.skill || 'N/A '}{` `}
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
                        <SchedudlePlaceholderAvatarIcon/>
                    )
                  }
                  <div className={classes.replacedEmployee__user__info}>
                    <div className={classes.replacedEmployee__user__info__fullName}>
                      {newEmployee.name}
                    </div>
                    <div className={classes.replacedEmployee__user__info__bottom}>
                      {newEmployee.skill || 'N/A '}{` `}
                      <span className={classes.replacedEmployee__user__info__bottom__status}>
                        {
                          isToday ? '' : 'Change'
                        }
                  </span>
                    </div>
                  </div>
                </div>
                {
                  isToday ? (
                      ''
                  ):<>
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
                  </>
                }
                <div className={classes.replacedEmployee__space} />
              </Content>
          )
        }
      </>
  );
};
