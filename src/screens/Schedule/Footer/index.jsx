import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { TIMELINE, TIMES_PANEL } from '../../../const';
import { timeToHours } from '../../../components/Helpers';
import Item from '../DayTotal';
import DayOfMonth from './DayOfMonth';

import classes from './Footer.module.scss';
import CurrencySign from "../../../components/shared/CurrencySign";

export default ({
  timeline,
  data,
  withCost,
  daysOfMonth,
}) => {
  const { t } = useTranslation();
  const containerClasses = classNames(classes.footer, {
    [classes[`footer_${timeline}`]]: !!timeline,
  });

  const time = useMemo(() => {
    if (timeline === TIMELINE.DAY) {
      return timeToHours(data.time);
    }

    return 0;
  }, [data.time]);

  return (
    <div
      id='schedule-footer'
      data-timeline={timeline}
      className={containerClasses}
    >
      {
        timeline === TIMELINE.DAY && (
          <>
            {
              data.photos?.map((photo) => photo && (
                <img
                  key={photo}
                  alt='avatar'
                  className={classes.footer__avatar}
                  src={photo}
                />
              ))
            }
            <span className={classes.footer__empoyees}>
              {`${data.employeesCount ?? 0} ${t('employees')}`}
            </span>
            <span className={classes.footer__total}>
              {`${t('Total Time')}: `}
              <span className={classes.footer__total__value}>
                {`${time} ${t('hours')}`}
              </span>
            </span>
            {
              withCost && (
                <span className={classes.footer__total}>
                  {`${t('Total Cost')}: `}
                  <span className={classes.footer__total__value}>
                    {`${data.cost ?? 0}`} <CurrencySign/>
                  </span>
                </span>
              )
            }
          </>
        )
      }
      {
        timeline === TIMELINE.WEEK && TIMES_PANEL.map((item) => (
          <Item
            key={item}
            employeesCount={data[item - 1]?.employeesCount}
            empty={!data[item - 1]?.employeesCount}
            photos={data[item - 1 - 1]?.photos ?? []}
            hours={data[item - 1]?.time ?? 0}
            money={data[item - 1]?.cost ?? 0}
            title={data[item - 1]?.title}
            nested={data[item - 1]?.children}
            withCost={withCost}
          />
        ))
      }
      {
        timeline === TIMELINE.MONTH && (
          <>
            <Item
              employeesCount={data.total?.employeesCount}
              empty={!data.total?.employeesCount}
              photos={data.total?.photos ?? []}
              hours={data.total?.time ?? 0}
              money={data.total?.cost ?? 0}
              title={data.total?.title}
              nested={data.total?.children}
              withCost={withCost}
            />
            <div className={classes.footer__items}>
              {
                daysOfMonth.map((item) => (
                  <DayOfMonth
                    key={item.id}
                    statistic={item.statistic}
                    withCost={withCost}
                    nested={data[item.id]?.children}
                    // eslint-disable-next-line no-nested-ternary
                    text={item.statistic
                      ? item.id === 'totalTime'
                        ? `${data.total?.time ?? 0} h`
                        : `${data.total?.cost ?? 0}`
                      : ''}
                    // title={data[item.id].title}
                  />
                ))
              }
              <CurrencySign/>
            </div>
            <div className={classes.footer__empty} />
          </>
        )
      }
    </div>
  );
};
