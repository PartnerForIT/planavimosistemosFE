import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

import Cell from '../Cell';
import classes from './RowContent.module.scss';

const RowContent = ({
  resourceId,
  employeeId,
  resources,
  events,
  daysOfMonth,
  expander,
  markerActive,
  pastDay,
  handleMarker,
  scheduleSettings,
  currentResource,
  copyTool,
  workTime,
  resource,
  permissions,
  markers,
  handleChangeEmployee,
  handleEmptyTimeline,
  handleCopyTool,
  handleAddHistory,
  currentMonth,
  handleEditWorkingTime,
  handleDuplicateEmployee,
  handleDeleteWorkingTime,
}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  
  const newFoundItem = (day) => {
    const ev = {...events.find((item) => resourceId === item.resourceId && (item.day ? item.day*1 : item.day_number*1) === day*1)};
    ev.real_title = ev?.title;
    if (ev?.copy_event) {
      ev.title = `${moment(ev.start).format("HH:mm")}-${moment(ev.end).format("HH:mm")}`;
      ev.hours = Math.round((moment(ev.end).diff(moment(ev.start), 'hours', true)) * 10) / 10;
    }

    const all_at_this_day = events.filter((item) => resourceId === item.resourceId && (item.day ? item.day*1 : item.day_number*1) === day*1);
    if (all_at_this_day.length > 1) {
      let hours = 0;
      let minutes = 0;
      let start = false;
      let end = false;
      
      for (let i in all_at_this_day) {
        if (all_at_this_day[i].hours) {
          hours += all_at_this_day[i].hours*1
          minutes += all_at_this_day[i].minutes*1

          start = start ? moment(all_at_this_day[i].start).isBefore(moment(start)) ? all_at_this_day[i].start : start : all_at_this_day[i].start
          end = end ? moment(all_at_this_day[i].end).isAfter(moment(end)) ? all_at_this_day[i].end : end : all_at_this_day[i].end
        }
      }

      ev.minutes = minutes
      ev.title = start && end ? `${moment(start).format("HH:mm")}-${moment(end).format("HH:mm")}` : '';
      ev.hours = hours
      ev.start = start
      ev.end = end
    } else {
      ev.title = `${moment(ev.start).format("HH:mm")}-${moment(ev.end).format("HH:mm")}`;
    }

    return ev;
  }
  
  let time = 0;
  let cost = 0;
  let night_duration = 0;
  const check = (statistic, id, night = false) => {
    if (statistic && id === "totalTime"){
      if (night) {
        return Math.round(night_duration*100)/100;
      }
      return Math.round(time*100)/100;
    }
    if (statistic && id === "totalCost" && !night){
      return parseFloat(cost).toFixed(2);
    }

    return ''
  }

  const checkMarked = (item) => {
    if (!item.statistic && employeeId){
      return item.markers.find(m => m.employee_id*1 === employeeId*1);
    }

    return false;
  }
  
  return (
    <>
      <div className={classes.rowContent}>
        {
          daysOfMonth.map((item, index) => {
                  if(index < item.id ){
                    time+=newFoundItem(item.title)?.hours ?? 0
                    cost+=newFoundItem(item.title)?.cost ? newFoundItem(item.title)?.cost*1 : 0
                    night_duration+=newFoundItem(item.title)?.night_duration ?? 0
                  }
         return (
             <Cell
                event={newFoundItem(item.title)}
                currentDay={index+1}
                currentMonth={currentMonth}
                key={item.id}
                title={item.statistic ? check(item.statistic, item.id) : (newFoundItem(item.title)?.hours ?? '')}
                startFinish={item.statistic || !employeeId ? '' : (newFoundItem(item.title)?.title ?? '')}
                statistic={item.statistic}
                borderColor={currentResource?.eventBorderColor}
                weekend={item.weekend}
                past={!item.statistic && pastDay >= item.id}
                marker={checkMarked(item)}
                markerActive={markerActive && employeeId && !item.statistic}
                handleMarker={() => { handleMarker(employeeId, item.id) } }
                night_duration={item.statistic ? check(item.statistic, item.id, true) : (newFoundItem(item.title)?.night_duration ?? false)}
                scheduleSettings={scheduleSettings}
                copyTool={copyTool}
                workTime={workTime}
                resource={resource}
                permissions={permissions}
                events={events}
                markers={markers}
                handleChangeEmployee={handleChangeEmployee}
                handleEmptyTimeline={handleEmptyTimeline}
                handleCopyTool={handleCopyTool}
                handleAddHistory={handleAddHistory}
                handleEditWorkingTime={handleEditWorkingTime}
                handleDuplicateEmployee={handleDuplicateEmployee}
                handleDeleteWorkingTime={handleDeleteWorkingTime}
            />)
          }
          )
        }
      </div>
      {
        (expander || markerActive) && resources?.map((item) => (
          <RowContent
            key={item.id}
            events={events}
            employeeId={item.employee_id}
            handleMarker={handleMarker}
            resourceId={item.id}
            resource={item}
            resources={item.children}
            expander={item.expander}
            currentResource={item}
            markerActive={markerActive}
            daysOfMonth={daysOfMonth}
            pastDay={pastDay}
            scheduleSettings={scheduleSettings}
            copyTool={copyTool}
            workTime={workTime}
            permissions={permissions}
            markers={markers}
            handleChangeEmployee={handleChangeEmployee}
            handleEmptyTimeline={handleEmptyTimeline}
            handleCopyTool={handleCopyTool}
            handleAddHistory={handleAddHistory}
            currentMonth={currentMonth}
            handleEditWorkingTime={handleEditWorkingTime}
            handleDuplicateEmployee={handleDuplicateEmployee}
            handleDeleteWorkingTime={handleDeleteWorkingTime}
          />
        ))
      }
    </>
  );
};

export default RowContent;
