import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import getOverflowParent from '../../../../../helpers/getOverflowParent';
import Dots from '../../../../Icons/Dots';
import InputNumber from '../InputNumber';
import classes from './Section.module.scss';

export default ({
  title,
  avatar,
  expander,
  withExpander,
  onExpander,
  withNumberInput,
  count,
  onChangeNumber,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);

  const sectionClass = classnames('section', classes.section, {
    [classes.section_openMenu]: isOpenMenu,
  });

  const handleCloseModal = () => {
    setIsOpenMenu(false);
  };
  const handleClickOpenMenu = () => {
    setIsOpenMenu((prevState) => !prevState);
  };

  useEffect(() => {
    if (isOpenMenu) {
      try {
        const buttonBounding = buttonRef.current.getBoundingClientRect();
        const parentBounding = getOverflowParent(buttonRef.current).getBoundingClientRect();
        const { height: heightContent } = contentBoxRef.current.getBoundingClientRect();
        const offsetBottom = parentBounding.height - buttonBounding.top - buttonBounding.height - 30;

        const menuPlacement = ((offsetBottom - heightContent) > 0) ? 'bottom' : 'top';

        const newClasses = [];

        if (menuPlacement === 'top') {
          newClasses.push(classes.section__modal_top);
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
      {title}
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
      <ClickAwayListener onClickAway={handleCloseModal}>
        <div className={classes.section__menu}>
          <button
            className={classes.section__menu__button}
            onClick={handleClickOpenMenu}
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
    </div>
  );
};
