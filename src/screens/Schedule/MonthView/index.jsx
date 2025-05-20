import React, {
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Scrollbar from 'react-scrollbars-custom';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';

import ResourceAreaHeader from '../ResourceAreaHeader';
import Footer from '../Footer';
import { TIMELINE } from '../../../const';
import ResourcesBlock from './ResourcesBlock';
import RowContent from './RowContent';
import Cell from './Cell';
import classes from './MonthView.module.scss';

window.requestIdleCallback = window.requestIdleCallback ||
  function (cb) {
    return setTimeout(() => {
      const start = Date.now();
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

window.cancelIdleCallback = 
  window.cancelIdleCallback || 
  function (id) {
    clearTimeout(id);
  };

const trackYProps = {
  renderer: ({ elementRef, ...props }) => (
    <span
      {...props}
      ref={elementRef}
      className={classes.scrollableContent__scrollbarTrackY}
    />
  ),
};

const getAllResourceIds = (items) => {
  let ids = [];
  const traverse = (arr) => {
    arr.forEach((item) => {
      ids.push(item.id);
      if (item.children?.length) {
        traverse(item.children);
      }
    });
  };

  traverse(items);
  return ids;
};

const applyExpanders = (items, expandedIds) => {
  return items.map(item => ({
    ...item,
    expander: expandedIds.includes(item.id),
    children: item.children ? applyExpanders(item.children, expandedIds) : [],
  }));
};

export default ({
  resources: externalResources,
  events,
  holidays,
  markers,
  onChangeMonth,
  withCost,
  timesPanel,
  accumulatedHours,
  markerActive,
  handleMarker,
  scheduleSettings,
  copyTool,
  workTime,
  permissions,
  handleChangeEmployee,
  handleChangeWorkingTime,
  handleDeleteTimeline,
  handleEmptyTimeline,
  handleAddWorkingTime,
  handleCopyTool,
  handleAddHistory,
  addTempEmployees,
  handleChangeTimeline,
  onEditShift,
  onGenerateTimes,
  checkIfEventsExist,
  onClearTimes,
  onDeleteShift,
}) => {
  const { t, i18n } = useTranslation();
  const { id: companyId } = useParams();
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
  const [resources, setResources] = useState([]);
  const [firstRenderFinished, setFirstRenderFinished] = useState(false)
  
  const [expandedIds, setExpandedIds] = useState(() => {
    const stored = localStorage.getItem('resourcesExpandersIds'+companyId);
    if (stored && stored !== 'undefined') {
      return JSON.parse(stored);
    }
    return getAllResourceIds(externalResources);
  });

  useEffect(() => {
    console.log('MOUNT')
    requestAnimationFrame(() => {
      console.log("First frame painted");
      setFirstRenderFinished(true)
    });
    requestIdleCallback(() => {
      console.log("Browser is idle after render");
      ReactTooltip.rebuild()
      
    });
  }, [])

  useEffect(() => {
    localStorage.setItem('resourcesExpandersIds'+companyId, JSON.stringify(expandedIds));
  }, [expandedIds, companyId]);
  
  useEffect(() => {
    setResources(applyExpanders(externalResources, expandedIds))
  }, [externalResources, expandedIds])

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
        holiday: holidays && holidays[index + 1] ? holidays[index + 1] : false,
        markers: markers.filter((marker) => day.isSame(moment(marker.date), 'day'))
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
  }, [i18n.language, currentMonth, withCost, holidays, markers]);

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

  const handleExpander = ({ rowId }) => {
    setExpandedIds(prev => {
      return prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId];
    });
  };

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

  const onHandleMarker = (employeeId, day) => {
    if (employeeId && day && markerActive) {
      const date = currentMonth.clone().set('date', day);
      handleMarker(employeeId, date);
    }
  };

  const onClickDay = (day) => {
    if (day) {
      const date = currentMonth.clone().set('date', day);
      handleChangeTimeline(TIMELINE.DAY, date);
    }
  }

  return (
    <>
      <div className={classes.monthView}>
        <div className={classes.monthView__header}>
          <ResourceAreaHeader
            title={`${t(currentMonth.format('MMMM'))} ${currentMonth.format('yyyy')}`}
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
                  holiday={item.holiday}
                  handleMarker={() => { onClickDay(item.title) }}
                  firstRenderFinished={true}
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
              markerActive={markerActive}
              currentMonth={currentMonth}
              accumulatedHours={accumulatedHours}
              onEditShift={onEditShift}
              onGenerateTimes={onGenerateTimes}
              checkIfEventsExist={checkIfEventsExist}
              onClearTimes={onClearTimes}
              onDeleteShift={onDeleteShift}
            />
            <div className={classes.monthView__content__data}>
              {
                resources.map((item) => (
                  <RowContent
                    key={item.id}
                    resourceId={item.id}
                    resources={item.children}
                    expander={item.expander}
                    markerActive={markerActive}
                    handleMarker={onHandleMarker}
                    daysOfMonth={daysOfMonth}
                    events={events}
                    pastDay={flexBackground.past}
                    scheduleSettings={scheduleSettings}
                    copyTool={copyTool}
                    workTime={workTime}
                    permissions={permissions}
                    markers={markers}
                    handleChangeEmployee={handleChangeEmployee}
                    handleChangeWorkingTime={handleChangeWorkingTime}
                    handleDeleteTimeline={handleDeleteTimeline}
                    handleEmptyTimeline={handleEmptyTimeline}
                    handleAddWorkingTime={handleAddWorkingTime}
                    handleCopyTool={handleCopyTool}
                    handleAddHistory={handleAddHistory}
                    addTempEmployees={addTempEmployees}
                    currentMonth={currentMonth}
                    firstRenderFinished={firstRenderFinished}
                  />
                ))
              }
              <ReactTooltip
                id='title'
                className={classes.monthView__content__data__tooltip}
                effect='solid'
              />
              <ReactTooltip
                id='holiday'
                className={classes.monthView__content__data__tooltip}
                effect='solid'
              />
              <ReactTooltip
                id='user_marker'
                className={classes.monthView__content__data__tooltip__marker}
                effect='solid'
              />
              <ReactTooltip
                id='demand_hours'
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
                <div className={
                  classNames(
                    classes.monthView__content__data__backgroundProgress__statistic,
                    {
                      [classes.monthView__content__data__backgroundProgress__statistic__withCost]: withCost,
                    },
                  )} />
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