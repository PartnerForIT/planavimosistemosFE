import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom';
import ReactTooltip from 'react-tooltip';

import ResourceAreaHeader from '../ResourceAreaHeader';
import Footer from '../Footer';
import { TIMELINE } from '../../../const';
import ResourcesBlock from './ResourcesBlock';
import RowContent from './RowContent';
import Cell from './Cell';
import classes from './MonthView.module.scss';

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
  events,
  onChangeMonth,
  withCost,
  timesPanel,
}) => {
  const { t, i18n } = useTranslation();
  const [resources, setResources] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));

  const handleExpander = ({ rowId }) => {
    setResources((prevState) => {
      const changeExpander = (items) => {
        if (!items?.length) {
          return undefined;
        }

        return items.map((item) => {
          if (item.id === rowId) {
            return {
              ...item,
              expander: !item.expander,
            };
          }

          return {
            ...item,
            children: changeExpander(item.children),
          };
        });
      };
      return changeExpander(prevState);
    });
  };
  const handleClickPrevMonth = () => {
    const nextMonth = currentMonth.clone().add('months', -1);
    setCurrentMonth(nextMonth);
    onChangeMonth({ fromDate: nextMonth });
  };
  const handleClickNextMonth = () => {
    const nextMonth = currentMonth.clone().add('months', 1);
    setCurrentMonth(nextMonth);
    onChangeMonth({ fromDate: nextMonth });
  };

  const daysOfMonth = useMemo(() => {
    const day = currentMonth.clone().add('days', -1);
    const arr = new Array(currentMonth.daysInMonth()).fill().map((_, index) => {
      const dayNumber = day.add('days', 1).day();
      const currentDay = moment();
      
      return {
        id: index + 1,
        title: index + 1,
        weekend: dayNumber === 6 || dayNumber === 0,
        today: currentDay.isSame(day, 'day'),
      };
    });
    arr.push({
      id: 'totalTime',
      title: t('Total Time'),
      statistic: true,
    });

    if (withCost) {
      arr.push({
        id: 'totalCost',
        title: t('Total Cost'),
        statistic: true,
      });
    }

    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, currentMonth, withCost]);
  const backgroundArr = useMemo(() => {
    const getCount = (items) => {
      if (!items?.length) {
        return 0;
      }

      return items.reduce((acc, item) => (acc + 1 + (item.expander ? getCount(item.children) : 0)), 0);
    };

    const countRows = Math.ceil((window.innerHeight - 298/* - 1 */) / 41);
    const countResources = getCount(resources);
    const count = countRows > countResources ? (countRows - countResources) : 0;

    return new Array(count)
      .fill()
      .map((_, index) => ({
        id: `row-background-${index}`,
      }));
  }, [resources]);
  const flexBackground = useMemo(() => {
    const currentDay = moment();

    if (currentMonth.isBefore(currentDay)) {
      let past;
      let future;

      if (currentMonth.isSame(currentDay, 'month')) {
        past = currentDay.date() - 1;
        future = currentMonth.daysInMonth() - past;
      } else {
        future = 0;
        past = currentMonth.daysInMonth();
      }

      return {
        past,
        future,
      };
    }

    return { past: 0, future: 0 };
  }, [currentMonth]);

  useEffect(() => {
    setResources(externalResources);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalResources]);
  
  return (
    <>
      <div className={classes.monthView}>
        <div className={classes.monthView__header}>
          <ResourceAreaHeader
            title={currentMonth.format('MMMM yyyy')}
            onClickPrev={handleClickPrevMonth}
            onClickNext={handleClickNextMonth}
          />
          <div className={classes.monthView__header__data}>
            {
              daysOfMonth.map((item) => (
                <Cell
                  key={item.id}
                  title={item.title}
                  statistic={item.statistic}
                  past={!item.statistic && flexBackground.past >= item.id}
                  today={item.today}
                  header
                />
              ))
            }
          </div>
          <div className={classes.monthView__header__empty} />
        </div>
        <Scrollbar
          className={classes.scrollableContent}
          trackYProps={trackYProps}
          noScrollX
        >
          <div className={classes.monthView__content}>
            <ResourcesBlock
              resources={resources}
              onExpander={handleExpander}
              currentMonth={currentMonth}
            />
            <div className={classes.monthView__content__data}>
              {
                // <div className={classes.monthView__content__data__divideRow}>
                //   {
                //     daysOfMonth.map((item) => (
                //         <Cell
                //             key={item.id}
                //             statistic={item.statistic}
                //             weekend={item.weekend}
                //         />
                //     ))
                //   }
                // </div>
              }
              {
                resources.map((item) => (
                  <RowContent
                    key={item.id}
                    resourceId={item.id}
                    resources={item.children}
                    expander={item.expander}
                    daysOfMonth={daysOfMonth}
                    events={events}
                    pastDay={flexBackground.past}
                  />
                ))
              }
              <ReactTooltip
                id='title'
                className={classes.monthView__content__data__tooltip}
                effect='solid'
              />
              {backgroundArr.map((item) => (
                <div
                  key={`cell-background-${item.id}`}
                  className={classes.monthView__content__data__backgroundRow}
                >
                  {
                    daysOfMonth.map((itemJ) => (
                      <Cell
                        key={itemJ.id}
                        statistic={itemJ.statistic}
                        weekend={itemJ.weekend}
                      />
                    ))
                  }
                </div>
              ))}
              <div className={classes.monthView__content__data__backgroundProgress}>
                <div
                  className={classes.monthView__content__data__backgroundProgress__daysGoneBy}
                  style={{ flex: flexBackground.past }}
                />
                <div style={{ flex: flexBackground.future }} />
                <div className={classes.monthView__content__data__backgroundProgress__statistic} />
              </div>
            </div>
            <div className={classes.monthView__content__srollPanel} />
          </div>
        </Scrollbar>
      </div>
      <Footer
        timeline={TIMELINE.MONTH}
        data={timesPanel}
        withCost={withCost}
        daysOfMonth={daysOfMonth}
      />
    </>
  );
};
