import React from 'react';
import { useTranslation } from 'react-i18next';

import Dropdown from '../Dropdown';
import moment from 'moment';

import classNames from 'classnames';
import classes from './ResourceItem.module.scss';
import useCompanyInfo from '../../../hooks/useCompanyInfo';

export default ({
  title,
  photo,
  accumulatedHours,
  employeeId,
  withMenu,
  onEditShift,
  onDeleteShift,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useCompanyInfo();
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });
  const demandClasses = classNames(
    classes.resourceItem__demand,
    {
      [classes.resourceItem__demand_red]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours < accumulatedHours?.totalHours,
      [classes.resourceItem__demand_gray]: !accumulatedHours?.totalHours && !accumulatedHours?.totalHours,
      [classes.resourceItem__demand_green]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours == accumulatedHours?.totalHours,
      [classes.resourceItem__demand_orange]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours > accumulatedHours?.totalHours,
    },
  );

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
  
  return (
    <>
      {
        (title.includes('Empty'))
            ?  <div className={classes.resourceItem__empty}><span>Empty</span></div>
            : title
      }
      {
        employeeId && (
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
        photo && (
          <img
            alt=''
            // className={styles.cellNameWithAvatar__image}
            src={photo}
          />
        )
      }
      {
        withMenu && (
          <Dropdown buttonClass={classes.resourceItem__buttonDots}>
            <div className={classes.resourceItem__title}>
              {title}
            </div>
            <Dropdown.ItemMenu
              title={t('Edit Shift')}
              onClick={onEditShift}
            />
            <Dropdown.ItemMenu
              title={t('Delete Shift')}
              onClick={onDeleteShift}
              remove
            />
            <div className={classes.resourceItem__space} />
          </Dropdown>
        )
      }
      {/*<div onClick={addEmployee}>Empty</div>*/}
    </>
  );
};
