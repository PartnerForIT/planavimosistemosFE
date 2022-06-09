import React, {useEffect, useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { TIMELINE, TIMES_PANEL } from '../../../const';
import { timeToHours } from '../../../components/Helpers';
import Item from '../DayTotal';
import DayOfMonth from './DayOfMonth';

import classes from './Footer.module.scss';
import CurrencySign from "../../../components/shared/CurrencySign";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {currencySelector, settingCompanySelector, settingsLoadingSelector} from "../../../store/settings/selectors";
import {getCurrencies, getSettingCompany} from "../../../store/settings/actions";
import _ from "lodash";

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
  const dispatch = useDispatch();

  const { id } = useParams();
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const settingsLoading = useSelector(settingsLoadingSelector);

  const time = useMemo(() => {
    if (timeline === TIMELINE.DAY) {
      return timeToHours(data.time);
    }

    return 0;
  }, [data.time]);

  const night_duration = useMemo(() => {
    if (timeline === TIMELINE.DAY) {
      return timeToHours(data.night_duration);
    }

    return 0;
  }, [data.night_duration]);

  useEffect(() => {
    if (Array.isArray(currencies) && !currencies.length && !settingsLoading) {
      dispatch(getCurrencies());
    }
  }, [currencies, dispatch, settingsLoading]);

  useEffect(() => {
    if (_.isEmpty(company) && !settingsLoading) {
      dispatch(getSettingCompany(id));
    }
  }, [company, dispatch, id, settingsLoading]);

  const currency = useMemo(
      () => {
        if (Array.isArray(currencies)) {
          return currencies
              .find((curr) => curr.code === company?.currency || curr.name === company?.currency)?.symbol ?? '';
        }

        return '';
      },
      [company.currency, currencies],
  );
  
  const parsablePhotos = () => {
    if (typeof data.photos === 'object') {
      let result = [];
      for (let i in data.photos) {
        if (typeof data.photos[i] === 'object') {

        } else {
          result.push(data.photos[i]);
        }
      }

      return result;
    }

    return data.photos;
  };
  
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
              parsablePhotos()?.map((photo) => photo && (
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
              night_duration && night_duration != '0' ? (
                <span className={classes.footer__total}>
                  {`${t('Night Time')}: `}
                  <span className={classes.footer__total__value}>
                    <span className={classes.footer__total__value_night}>
                      {`${night_duration} ${t('hours')}`}
                    </span>
                  </span>
                </span>
              ) : ''
            }
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
            employeesCount={item - 1 >= 0 ? data[item - 1]?.employeesCount : data.total?.employeesCount}
            empty={item - 1 >= 0 ? !data[item - 1]?.employeesCount : !data.total?.employeesCount}
            photos={item - 1 >= 0 ? (data[item - 1]?.photos ?? []) : (data.total?.photos ?? [])}
            hours={item - 1 >= 0 ? (data[item - 1]?.time ?? data.total?.time) : data.total?.time}
            night_time={item - 1 >= 0 ? (data[item - 1]?.night_duration ?? data.total?.night_duration) : data.total?.night_duration}
            money={item - 1 >= 0 ? (data[item - 1]?.cost ?? data.total?.cost) : data.total?.cost}
            title={item - 1 >= 0 ? (data[item - 1]?.title) : (data.total?.title)}
            nested={item - 1 >= 0 ? (data[item - 1]?.children) : (data.total?.children)}
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
              night_time={data.total?.night_duration ?? 0}
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
                        : `${data.total?.cost ?? 0 } ${currency}`
                      : ''}
                    night_time={item.statistic
                      ? item.id === 'totalTime'
                        ? data.total?.night_duration ?? ''
                        : ''
                      : ''}
                    // title={data[item.id].title}
                  />
                ))
              }
            </div>
            <div className={classes.footer__empty} />
          </>
        )
      }
    </div>
  );
};
