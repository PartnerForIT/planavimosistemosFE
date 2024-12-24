import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import getOverflowParent from '../../../../helpers/getOverflowParent';
import Dots from '../../../../components/Icons/Dots';
import Content from '../../Dropdown/Content';
import classes from './Section.module.scss';
import AddEmployee from '../../AddEmployee';

export default ({
  title,
  skill,
  avatar,
  expander,
  withExpander,
  onExpander,
  onDelete,
  onAddEmployees,
  unavailableEmployees,
}) => {
  const { t } = useTranslation();

  const handleCloseModal = () => {
    setIsOpenMenu(false);
  };
  const handleClickOpenMenu = () => {
    setIsOpenMenu((prevState) => !prevState);
  };

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenEmployees, setIsOpenEmployees] = useState(false);
  const buttonRef = useRef(null);
  const buttonPlusRef = useRef(null);
  const contentBoxRef = useRef(null);
  const dropdownRef = useRef(null);

  const sectionClass = classnames('section', classes.section, {
    [classes.section_openMenu]: isOpenMenu,
    [classes.section_addEmployees]: onAddEmployees
  });

  useEffect(() => {
    if (isOpenMenu) {
      try {
        const buttonBounding = buttonRef.current.getBoundingClientRect();
        const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
        const { height: heightContent } = contentBoxRef.current.getBoundingClientRect();
        const offsetBottom = parentBounding.bottom - buttonBounding.bottom;

        const menuPlacement = ((offsetBottom - heightContent) > 50) ? 'bottom' : 'top';

        const newClasses = [];

        if (menuPlacement === 'top') {
          newClasses.push(classes.section__menu__modal_top);
        }

        if (newClasses.length) {
          contentBoxRef.current.classList.add(...newClasses);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpenMenu]);

  return (
    <div className={sectionClass}>
      <div className={classes.section__outer} onClick={onAddEmployees ? () => setIsOpenEmployees(true) : null}>
        <div className={classes.section__titleBlock}>
          <div className={classes.section__name}>{onAddEmployees ? t('Add Employees') : title}</div>
          {
            skill && (
              <div className={classes.section__skill}>{skill}</div>
            )
          }
        </div>
        {
          onAddEmployees && (
            <div ref={buttonPlusRef} className={classes.section_addEmployees_circle}>+</div>
          )
        }
        {
          (withExpander) && (
            <div className={classes.section__options}>
              {
                withExpander && (
                  <button
                    // eslint-disable-next-line max-len
                    className={`${classes.section__options__expander} ${expander ? classes.section__options__expander_open : ''}`}
                    aria-label='expander'
                    onClick={onExpander}
                  />
                )
              }
            </div>
          )
        }
        {
          avatar && (
            <img
              className={classes.section__avatar}
              src={avatar}
              alt='avatar'
            />
          )
        }
        {
          !onAddEmployees && (
            <ClickAwayListener onClickAway={handleCloseModal}>
              <div className={classes.section__menu}>
                <button
                  className={classes.section__menu__button}
                  onClick={handleClickOpenMenu}
                  ref={buttonRef}
                >
                  <Dots />
                </button>
                {
                  (isOpenMenu) && (
                    <div className={classes.section__menu__modal} ref={contentBoxRef}>
                      <div className={classes.section__menu__modal__title}>
                        {title}
                      </div>
                      <button
                        className={classes.section__menu__modal__item}
                        onClick={onDelete}
                      >
                        {t('Remove from list')}
                      </button>
                    </div>
                  )
                }
              </div>
            </ClickAwayListener>
          )
        }
      </div>
      {
        isOpenEmployees && (
          <Content
            onCancel={() => setIsOpenEmployees(false)}
            wrapperRef={dropdownRef}
            offset={buttonPlusRef.current.getBoundingClientRect()}
            onTop
            cancel
            withBorder
            maxHeight={433}
          >
            <AddEmployee
              onAddEmployee={(data) => { setIsOpenEmployees(false); onAddEmployees(data); }}
              unavailableEmployees={unavailableEmployees}
            />
          </Content>
        )
      }
    </div>
  );
};
