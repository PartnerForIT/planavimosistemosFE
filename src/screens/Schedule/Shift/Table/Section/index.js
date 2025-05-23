import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import getOverflowParent from '../../../../../helpers/getOverflowParent';
import Dots from '../../../../../components/Icons/Dots';
import Dropdown from '../../../Dropdown';
import InputNumber from '../InputNumber';
import classes from './Section.module.scss';

import moment from 'moment';

import useCompanyInfo from '../../../../../hooks/useCompanyInfo';

export default ({
  title,
  avatar,
  expander,
  withExpander,
  withTemplate,
  onExpander,
  withNumberInput,
  count,
  onChangeNumber,
  onDelete,
  withMenu,
  withMenuEdit,
  nestingLevel = 1,
  employeeId,
  accumulatedHours,
  onEditShift,
  onGenerateTimes,
  onClearTimes,
  onDeleteShift,
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

  const handleCloseModal = () => {
    setIsOpenMenu(false);
  };
  const handleClickOpenMenu = () => {
    setIsOpenMenu((prevState) => !prevState);
  };

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const buttonRef = useRef(null);
  const contentBoxRef = useRef(null);
  const dropdownRef = useRef(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sectionClass = classnames('section', classes.section, {
    [classes.section_openMenu]: isOpenMenu,
    [classes.section_dropdownOpen]: isDropdownOpen,
  });
  
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
              <b>${ t('Target time') }:</b>
          </td>
          <td>
            ${accumulatedHours?.totalHours || 0} ${t('hours')}
          </td>
        </tr>
        <tr>
          <td>
              <b>${ t('Planned time') } (${ t('period') }):</b>
          </td>
          <td>
            ${accumulatedHours?.actualHours || 0} ${t('hours')}
          </td>
        </tr>
        <tr>
          <td>
              <b>${ t('Registered time') } (${ t('period') }):</b>
          </td>
          <td>
            ${accumulatedHours?.rigisteredHoursPeriod || 0} ${t('hours')}
          </td>
        </tr>
        
        ${accumulatedHours?.accumulated_months > 1 ? `
          <tr>
            <td colspan="2"><hr></td>
          </tr>

          <tr>
            <td>
                <b>${ t('Target time') } (${ t('month') }):</b>
            </td>
            <td>
              ${accumulatedHours?.totalHoursMonth || 0} ${t('hours')}
            </td>
          </tr>
          <tr>
            <td>
                <b>${ t('Planned time') } (${ t('month') }):</b>
            </td>
            <td>
              ${accumulatedHours?.actualHoursMonth || 0} ${t('hours')}
            </td>
          </tr>
          <tr>
            <td>
                <b>${ t('Registered time') } (${ t('month') }):</b>
            </td>
            <td>
              ${accumulatedHours?.rigisteredHours || 0} ${t('hours')}
            </td>
          </tr>

        ` : ''}
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
        (withNumberInput || withExpander || withTemplate) && (
          <div className={classes.section__options}>
            { withTemplate && !employeeId && (
              <div className={classes.section__options__with_template}>A</div>
            )}
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
        (withMenu || withTemplate) && (
          <Dropdown onToggle={setIsDropdownOpen} buttonClass={classes.section__buttonDots} ref={dropdownRef}>
            <div className={classes.section__title}>
              {title}
            </div>
            {
              withTemplate && onGenerateTimes && (
                <Dropdown.ItemMenu
                  title={t('Generate Work Times')}
                  onClick={() => {
                    onGenerateTimes()
                    dropdownRef.current.close()
                  }}
                />
              )   
            } 
            {
              withTemplate && !onGenerateTimes && (
                <Dropdown.ItemMenu
                  title={t('Clear Work Times')}
                  onClick={() => {
                    onClearTimes()
                    dropdownRef.current.close()
                  }}
                />
              )   
            }
            {
              !employeeId && (
                <>
                  <Dropdown.ItemMenu
                    title={t('Edit Shift')}
                    onClick={onEditShift}
                  />
                  <Dropdown.ItemMenu
                    title={t('Delete Shift')}
                    onClick={onDeleteShift}
                    remove
                  />
                </>
              )
            }
            <div className={classes.section__space} />
          </Dropdown>
        )
      }
      {
        withMenuEdit && (
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
