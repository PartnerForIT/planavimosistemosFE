import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom';
import ReactTooltip from 'react-tooltip';

import ResourceAreaHeader from '../ResourceAreaHeader';
import ResourcesBlock from './ResourcesBlock';
import RowContent from './RowContent';
import Cell from './Cell';
import classes from './MonthView.module.scss';
import classnames from 'classnames';

const trackYProps = {
  renderer: ({ elementRef, ...props }) => (
    <span
      {...props}
      ref={elementRef}
      className={classes.scrollableContent__scrollbarTrackY}
    />
  ),
};

export default ({
  resources: externalResources,
  sheet,
  fields,
  holidays,
  onChangeMonth,
  withCost,
  withAccumulated,
}) => {
  const { t, i18n } = useTranslation();
  const [resources, setResources] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
  const contentRef = useRef(null);
  const headerRef = useRef(null);
  
  const handleClickPrevMonth = () => {
    const nextMonth = currentMonth.clone().add(-1, 'months');
    setCurrentMonth(nextMonth);
    onChangeMonth({ fromDate: nextMonth });
  };
  const handleClickNextMonth = () => {
    const nextMonth = currentMonth.clone().add(1, 'months');
    setCurrentMonth(nextMonth);
    onChangeMonth({ fromDate: nextMonth });
  };

  const daysOfMonth = useMemo(() => {
    const day = currentMonth.clone().add(-1, 'days');
    const arr = new Array(currentMonth.daysInMonth()).fill().map((_, index) => {
      const dayNumber = day.add(1, 'days').day();
      const currentDay = moment();

      return {
        id: index + 1,
        title: index + 1,
        weekend: dayNumber === 6 || dayNumber === 0,
        today: currentDay.isSame(day, 'day'),
        holiday: holidays[index + 1] ? holidays[index + 1] : false
      };
    });
    arr.push({
      id: 'totalTime',
      title: t('Total Time'),
      statistic: true,
    });

    if (withAccumulated) {
      arr.push({
        id: 'plannedTime',
        title: t('Planned Time _s'),
        statistic: true,
      });

      arr.push({
        id: 'targetTime',
        title: t('Target Time _s'),
        statistic: true,
      });
    }

    if (withCost) {
      arr.push({
        id: 'totalCost',
        title: t('Total Cost'),
        statistic: true,
      });
    }

    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, currentMonth, withCost, withAccumulated, holidays]);

  useEffect(() => {
    setResources(externalResources);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalResources]);



  useEffect(() => {

    const handleScrolling = (event) => {
      if(contentRef !== null && headerRef !== null && headerRef.current && contentRef.current && headerRef.current.scrollLeft !== contentRef.current.scrollLeft) {
        headerRef.current.scrollLeft = contentRef.current.scrollLeft;
      }
    }

    window.removeEventListener("wheel", handleScrolling);
    window.addEventListener("wheel", handleScrolling);
  })

  //fix for employee block height
  const empHeight = {
    0: 130,
    1: 130,
    2: 130,
    3: 139,
    4: 180,
    5: 221,
    6: 262,
    7: 303,
    8: 344,
  }

  return (
    <>
      <div className={classes.sheetmonthView}>
        <div className={classes.sheetmonthView__header}>
          <ResourceAreaHeader
            title={currentMonth.format('MMMM yyyy')}
            onClickPrev={handleClickPrevMonth}
            onClickNext={handleClickNextMonth}
          />
          <div className={classnames(classes.sheetmonthView__header__dataOuter, {
            [classes.sheetmonthView__header__dataOuter_withCost]: withCost,
            [classes.sheetmonthView__header__dataOuter_withAccumulated]: withAccumulated
            })}>
            <div
              ref={headerRef}
              className={classes.sheetmonthView__header__data}>
              <Cell
                key={0}
                title={t('Article name')}
                article={true}
                header
              />
              {
                daysOfMonth.map((item) => (
                  <Cell
                    key={item.id}
                    cellId={item.id}
                    title={item.title}
                    statistic={item.statistic}
                    today={item.today}
                    holiday={item.holiday}
                    header
                    tooltip={item.id === 'plannedTime' ? t('Planned Time _t') : item.id === 'targetTime' ? t('Target Time _t') : ''}
                  />
                ))
              }
            </div>
          </div>
          <div className={classes.sheetmonthView__header__empty} />
        </div>
        <Scrollbar
          className={classes.scrollableContent}
          trackYProps={trackYProps}
          noScrollX
        >
          <div className={classes.sheetmonthView__content}>
            <ResourcesBlock
              resources={resources}
              currentMonth={currentMonth}
              height={empHeight[fields.length]}
            />
            <div className={classnames(classes.sheetmonthView__content__dataOuter, {
              [classes.sheetmonthView__content__dataOuter_withCost]: withCost,
              [classes.sheetmonthView__content__dataOuter_withAccumulated]: withAccumulated
            })}>
              <div 
                ref={contentRef}
                className={classes.sheetmonthView__content__data}>
                {
                  resources.map((resource) => (
                    <div key={resource.id+'_'+resource.place_id} className={classes.sheetmonthView__content__data__wrap}>
                      {
                        resource ?
                          fields.map((item) => (
                            <RowContent
                              key={resource.id+'-'+item}
                              field={item}
                              resource={resource}
                              sheet={sheet}
                              daysOfMonth={daysOfMonth}
                            />
                          )) : null
                      }
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={classes.sheetmonthView__content__srollPanel} />
          </div>
        </Scrollbar>
      </div>
      <ReactTooltip
        id='title'
        className={classes.sheetmonthView__content__data__tooltip}
        effect='solid'
        html={true}
      />
      <ReactTooltip
        id='holiday'
        className={classes.sheetmonthView__content__data__tooltip}
        effect='solid'
      />
    </>
  );
};
