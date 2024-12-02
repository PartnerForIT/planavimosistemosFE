import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import getOverflowParent from '../../../../../helpers/getOverflowParent';
import Dots from '../../../../../components/Icons/Dots';
import Dropdown from '../../../Dropdown';
import InputNumber from '../InputNumber';
import classes from './Section.module.scss';

export default ({
  title,
  skill,
  avatar,
  expander,
  withExpander,
  onExpander,
  withNumberInput,
  count,
  onChangeNumber,
  onDelete,
  withMenu,
  withMenuEdit,
}) => {
  const { t } = useTranslation();

  const handleCloseModal = () => {
    setIsOpenMenu(false);
  };
  const handleClickOpenMenu = () => {
    setIsOpenMenu((prevState) => !prevState);
  };

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);

  const sectionClass = classnames('section', classes.section, {
    [classes.section_openMenu]: isOpenMenu,
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
      <div className={classes.section__titleBlock}>
        <div className={classes.section__name}>{title}</div>
        {
          skill && (
            <div className={classes.section__skill}>{skill}</div>
          )
        }
      </div>
      {
        (withNumberInput || withExpander) && (
          <div className={classes.section__options}>
            {
              withNumberInput && (
                <InputNumber
                  value={count}
                  onChange={onChangeNumber}
                />
              )
            }
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
        withMenu && false && (
          <Dropdown buttonClass={classes.section__buttonDots}>
            <div className={classes.section__title}>
              {title}
            </div>
            <div className={classes.section__space} />
          </Dropdown>
        )
      }
      {
        withMenuEdit && false && (
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
                      {t('Delete')}
                    </button>
                  </div>
                )
              }
            </div>
          </ClickAwayListener>
        )
      }
    </div>
  );
};
