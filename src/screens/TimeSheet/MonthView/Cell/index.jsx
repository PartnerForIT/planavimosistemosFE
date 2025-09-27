import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import HolidayIcon from '../../../../components/Core/HolidayIcon/HolidayIcon';
import TimeOffSymbol1 from '../../../../components/Icons/TimeOffSymbol1';
import TimeOffSymbol2 from '../../../../components/Icons/TimeOffSymbol2';
import TimeOffSymbol3 from '../../../../components/Icons/TimeOffSymbol3';
import TimeOffSymbol4 from '../../../../components/Icons/TimeOffSymbol4';
import TimeOffSymbol5 from '../../../../components/Icons/TimeOffSymbol5';
import TimeOffSymbol6 from '../../../../components/Icons/TimeOffSymbol6';
import TimeOffSymbol7 from '../../../../components/Icons/TimeOffSymbol7';
import TimeOffSymbol8 from '../../../../components/Icons/TimeOffSymbol8';
import TimeOffSymbol9 from '../../../../components/Icons/TimeOffSymbol9';

import classes from './Cell.module.scss';
import useCompanyInfo from '../../../../hooks/useCompanyInfo';

const Cell = ({
  cellId,
  title,
  statistic,
  article,
  weekend,
  past,
  today,
  header,
  holiday,
  night_duration,
  tooltip,
  requestBehalve,
}) => {
  const { t } = useTranslation();
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};
  const { getDateFormat } = useCompanyInfo();
  const dateFormat = getDateFormat({
    'YY.MM.DD': 'YYYY, MMM DD',
    'DD.MM.YY': 'DD MMM, YYYY',
    'MM.DD.YY': 'MMM DD, YYYY',
  });

  const cellClasses = classnames(classes.cell, {
    [classes.cell_statistic_time]: cellId === 'totalTime',
    [classes.cell_statistic_cost]: cellId === 'totalCost',
    [classes.cell_statistic_planned]: cellId === 'plannedTime' || cellId === 'plannedTimeMonth',
    [classes.cell_statistic_target]: cellId === 'targetTime' || cellId === 'targetTimeMonth',
    [classes.cell_statistic]: statistic,
    [classes.cell_article]: article,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_today]: today,
    [classes.cell_header]: header,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
  });

  const refCell = useRef();

  useEffect(() => {
    if (!header && (title || requestBehalve)) {
      if (refCell.current.scrollWidth >= refCell.current.offsetWidth || tooltip || requestBehalve) {
        if (!requestBehalve) {
          refCell.current.classList.add(classes.cell_doesNotFit);
        } else {
          refCell.current.classList.add(classes.cell_doesNotFit_request_behalve);
        }
        refCell.current.firstChild.style.maxWidth = `${refCell.current.offsetWidth - 4}px`;
      }
    }
    // eslint-disable-next-line
  }, [title, requestBehalve]);

  const requestBehalveTooltip = () => {
    if (!requestBehalve) {
      return null;
    }
    return `
      <div class="request-behalve-tooltip">
        ${requestBehalve.from === requestBehalve.to ? `${t('On')} <b>${moment(requestBehalve.from, 'YYYY-MM-DD').format(dateFormat)}</b>` : `${t('From')} <b>${moment(requestBehalve.from, 'YYYY-MM-DD').format(dateFormat)}</b> ${t('To')} <b>${moment(requestBehalve.to, 'YYYY-MM-DD').format(dateFormat)}</b>`}<br/>
        ${t('Policy')}: <b>${requestBehalve.policy_name}</b><br/>
        ${t('Status')}: <b style="color: ${requestBehalve.status === 'pending' ? '#fd9d27' : 'green'}">${requestBehalve.status.charAt(0).toUpperCase() + requestBehalve.status.slice(1)}</b>
      </div>
    `;
  };

  if (!header && (title || requestBehalve)) {
    return (
      <div className={cellClasses} ref={refCell} style={{backgroundColor: requestBehalve ? requestBehalve.color : null}}
        data-tooltip-id={requestBehalve ? 'title' : null}
        data-tooltip-html={`${requestBehalve ? requestBehalveTooltip() : null}`}
      >
        <div className={classes.cell__content} data-title={requestBehalve ? requestBehalveTooltip() : (tooltip ? tooltip : title)}>
          <div
            className={classes.cell__content__text}
            data-tooltip-id={!requestBehalve ? 'title' : null}
            data-tooltip-html={`${!requestBehalve ? (tooltip ? tooltip : title) : null}`}
          >
           { requestBehalve ? (
            <span className={classes.cell_request_behalve}>
              {requestBehalve.symbol === '1' && <TimeOffSymbol1 />}
              {requestBehalve.symbol === '2' && <TimeOffSymbol2 />}
              {requestBehalve.symbol === '3' && <TimeOffSymbol3 />}
              {requestBehalve.symbol === '4' && <TimeOffSymbol4 />}
              {requestBehalve.symbol === '5' && <TimeOffSymbol5 />}
              {requestBehalve.symbol === '6' && <TimeOffSymbol6 />}
              {requestBehalve.symbol === '7' && <TimeOffSymbol7 />}
              {requestBehalve.symbol === '8' && <TimeOffSymbol8 />}
              {requestBehalve.symbol === '9' && <TimeOffSymbol9 />}
              {requestBehalve.status === 'pending' && <span className={classes.cell_request_behalve_pending}></span>}
            </span>
           ) : (
            <>
              {title}
              {
                night_duration && night_duration > 0 ? (
                  <span className={classes.cell_night}>
                    {night_duration}
                  </span>
                ) : ''
              }
            </>
           )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cellClasses} ref={refCell}>
      <div
        data-tooltip-id='title'
        data-tooltip-html={`${tooltip ? tooltip : ''}`}
      >
        {title !== 0 ? title : ''}
      </div>
      
      { header && (
        <HolidayIcon
          holidays={holiday}
          month={true}
        />
      )}
    </div>
  );
};

export default Cell
