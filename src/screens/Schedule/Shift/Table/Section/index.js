import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import getOverflowParent from '../../../../../helpers/getOverflowParent';
import Dots from '../../../../../components/Icons/Dots';
import InputNumber from '../InputNumber';
import classes from './Section.module.scss';

import moment from 'moment';

import useCompanyInfo from '../../../../../hooks/useCompanyInfo';

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
  withMenu,
  nestingLevel = 1,
  employeeId,
  accumulatedHours,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useCompanyInfo();
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });
  const demandClasses = classnames(
    classes.section__demand,
    {
      [classes.section__demand_red]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours < accumulatedHours?.totalHours,
      [classes.section__demand_gray]: !accumulatedHours?.totalHours || !accumulatedHours?.actualHours,
      [classes.section__demand_green]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours === accumulatedHours?.totalHours,
      [classes.section__demand_orange]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours > accumulatedHours?.totalHours,
    },
  );

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

  const demandTip = () => {
    return `
      <table>
        <tr>
          <td>
              <b>${ t('Period') }:</b>
          </td>
          <td>
            ${moment(accumulatedHours?.startPeriod).format(formatDate)} - ${moment(accumulatedHours?.endPeriod).format(formatDate)}
          </td>
        </tr>
        <tr>
          <td>
              <b>${ t('Actual time') }:</b>
          </td>
          <td>
            ${accumulatedHours?.actualHours || 0} hours
          </td>
        </tr>
        <tr>
          <td>
              <b>${ t('Target time') }:</b>
          </td>
          <td>
            ${accumulatedHours?.totalHours || 0} hours
          </td>
        </tr>
      </table>
    `
  };

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
    <div style={{ backgroundColor: `${nestingLevel === 0 ? 'lightgray' : 'inherit'}` }} className={sectionClass}>
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
        accumulatedHours?.startPeriod && employeeId && (
          <div
            data-for='demand_hours'
            data-tip={demandTip()}
            data-html={true}
            className={demandClasses}>
              {
                !accumulatedHours?.actualHours && !accumulatedHours?.totalHours ?
                ('n/a') :
                ((accumulatedHours?.actualHours ? accumulatedHours?.actualHours : '-')+'/'+(accumulatedHours?.totalHours ? accumulatedHours?.totalHours : '-'))
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
        withMenu && (
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
