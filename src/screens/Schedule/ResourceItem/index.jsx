import React, { useRef } from 'react';
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
  templateId,
  withMenu,
  shiftId,
  onEditShift,
  onDeleteShift,
  onGenerateTimes,
  onClearTimes,
  canClearTimesForShift,
}) => {
  const { t } = useTranslation();
  const { getDateFormat } = useCompanyInfo();
  const dropdownRef = useRef(null);
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });
  const demandClasses = classNames(
    classes.resourceItem__demand,
    {
      [classes.resourceItem__demand_red]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours < accumulatedHours?.totalHours,
      [classes.resourceItem__demand_gray]: !accumulatedHours?.totalHours || !accumulatedHours?.actualHours,
      [classes.resourceItem__demand_green]: accumulatedHours?.totalHours && accumulatedHours?.actualHours && accumulatedHours?.actualHours === accumulatedHours?.totalHours,
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

  const isEmpty = title.includes('Empty')
  
  return (
    <>
      {
        (title.includes('Empty'))
            ? <div className={classes.resourceItem__empty}><span>Empty</span></div>
            : <div style={{flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', marginRight: 15, textOverflow: 'ellipsis'}}>
                {title}
              </div>
      }
      {
        accumulatedHours?.startPeriod && employeeId && !isEmpty && (
          <div
            data-tooltip-id='demand_hours'
            data-tooltip-html={demandTip()}
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
          <div
            data-tooltip-id='user_avatar'
            data-tooltip-html={`<div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden;"><img alt="" style="width: 100%; height: 100%; object-fit: cover;" src="${photo}" /></div>`}
            style={{width: 20, height: 20}}
            className={classes.resourceItem__avatar_trigger}>
            <img alt='' src={photo} />
          </div>
        )
      }
      {
        templateId && shiftId
          ? <div className={classes.resourceItem__template}>A</div>
          : null
      }
      {
        withMenu && (
          <Dropdown ref={dropdownRef} buttonClass={classes.resourceItem__buttonDots}>
            <div className={classes.resourceItem__title}>
              {title}
            </div>
            {
              shiftId
                ? <>
                    {
                      canClearTimesForShift && templateId
                        ? <Dropdown.ItemMenu
                            title={t('Clear Work Times')}
                            onClick={() => {
                              onClearTimes(true)
                              dropdownRef.current.close()
                            }}
                          />
                        : templateId
                          ? <Dropdown.ItemMenu
                              title={t('Generate Work Times')}
                              onClick={() => {
                                onGenerateTimes()
                                dropdownRef.current.close()
                              }}
                            />
                          : null
                    }
                    <Dropdown.ItemMenu
                      title={t('Edit Shift')}
                      onClick={onEditShift}
                    />
                    <Dropdown.ItemMenu
                      title={t('Delete Shift')}
                      onClick={() => {
                        dropdownRef.current.close()
                        onDeleteShift()
                      }}
                      remove
                    />
                  </>
                : onGenerateTimes
                  ? <Dropdown.ItemMenu
                      title={t('Generate Work Times')}
                      onClick={() => {
                        onGenerateTimes()
                        dropdownRef.current.close()
                      }}
                    />
                  : <Dropdown.ItemMenu
                      title={t('Clear Work Times')}
                      onClick={() => {
                        onClearTimes()
                        dropdownRef.current.close()
                      }}
                    />
            }
            <div className={classes.resourceItem__space} />
          </Dropdown>
        )
      }
      {/*<div onClick={addEmployee}>Empty</div>*/}
    </>
  );
};
