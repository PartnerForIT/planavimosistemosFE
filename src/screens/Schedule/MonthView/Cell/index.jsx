import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import HolidayIcon from '../../../../components/Core/HolidayIcon/HolidayIcon';
import MoonIcon from '../../../../components/Icons/Moon';
import CellOptions from '../CellOptions';
import moment from 'moment';

import classes from './Cell.module.scss';

export default ({
  title,
  startFinish,
  statistic,
  weekend,
  past,
  marker,
  today,
  header,
  holiday,
  night_duration,
  markerActive,
  handleMarker,
  scheduleSettings,
  borderColor,
  event,
  copyTool,
  workTime,
  resource,
  permissions,
  events,
  markers,
  handleChangeEmployee,
  handleChangeWorkingTime,
  handleDeleteTimeline,
  handleEmptyTimeline,
  handleAddWorkingTime,
  handleCopyTool,
  handleAddHistory,
  addTempEmployees,
  currentDay,
}) => {
  
  const { t } = useTranslation();
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};

  const cellClasses = classnames(classes.cell, 'monthCell', {
    [classes.cell_statistic]: statistic,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_marker]: marker && !title,
    [classes.cell_marker_active]: markerActive && !header,
    [classes.cell_today]: today,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
    [classes.cell_start_finish]: (scheduleSettings?.start_finish && startFinish),
  });

  const refCell = useRef();
  
  useEffect(() => {
    if (!header && title) {
      if (refCell.current.scrollWidth >= refCell.current.offsetWidth) {
        refCell.current.classList.add(classes.cell_doesNotFit);
        refCell.current.firstChild.style.maxWidth = `${refCell.current.offsetWidth - 4}px`;
      }
    }
  }, [title]);

  let start = event ? moment(event.start) : null;
  let end = event ? moment(event.end) : null;

  if (event?.empty_manual && start && end && workTime?.work_time?.work_days?.days) {
    const time = workTime.work_time.work_days.days.find(i => i.day == moment(start).isoWeekday());
    if (time?.start) {
      const [h, m] = time.start.split(':');
      start = moment(start).set({h: h*1, m: m*1});
    } else {
      start = moment(start).set({h: 8});
    }
    
    if (time?.finish) {
      const [h, m] = time.finish.split(':');
      end = moment(end).set({h: h*1, m: m*1});
    } else {
      end = moment(end).set({h: 17});
    }
  }

  let shiftId;
  let employee_Id;
  let employeeName;
  let withMenu = false;
  let isCompleted = event?.is_completed;
  let jobTypeId;

  if (resource?.employeeId || resource?.employeeId == 0) {
    [shiftId, jobTypeId] = resource.id.split('-');
    withMenu = event ? true : false;
    employeeName = resource.title;
    employee_Id = resource.employeeId
    shiftId = resource.shift_id ? resource.shift_id : shiftId
  }

  let unEmployees = [];
  if (event) {
    const allEmployees  = events.filter(e => e.empty_employee === false
                                                    && e.resourceId.indexOf(shiftId+'-') == 0
                                                    && event.day_number == e.day_number);

    unEmployees = allEmployees.map(e => {
      if (e?.new_employee?.id) {
        return e?.new_employee?.id*1;
      }

      return e.employee_id*1;
    });
  }

  if (!header) {
    return (
      <div className={cellClasses} ref={refCell}>
        <div className={classes.cell__content} data-title={title ? title : null}>
          <div
            data-for='title'
            data-tip={title ? `${title} ${t('hours')}` : null}
            className={classnames(classes.cell__content__text, {[classes.cell__content__text_time]: scheduleSettings?.start_finish && startFinish})}
          >
            { title ? (
                <span className={classes.cell_day} style={{borderColor: borderColor ? borderColor : null}}dangerouslySetInnerHTML={{ __html: scheduleSettings?.start_finish && startFinish ? startFinish.replace('-', '<br />') : title }} />
              ) : null
            }
            {
              title && night_duration && night_duration > 0 ? (
                <span className={classes.cell_night}>
                  <MoonIcon />{night_duration}h
                </span>
              ) : null
            }

            { 
              <CellOptions
                id={event?.id}
                currentDay={currentDay}
                copy_event={event?.copy_event}
                empty={event?.empty_event}
                empty_manual={event?.empty_manual}
                newEmployee={event?.new_employee}
                oldEmployee={event?.old_employee}
                copyTool={copyTool}
                start={start}
                end={end}
                shiftId={shiftId}
                employeeId={employee_Id}
                employeeName={employeeName}
                resourceId={resource?.id}
                photo={resource?.photo}
                jobTypeName={resource?.job_type_name}
                withMenu={withMenu && !copyTool && permissions?.schedule_edit}
                editPermissions={permissions?.schedule_edit}
                isCompleted={isCompleted}
                unavailableEmployees={unEmployees}
                markers={markers}
                onChangeEmployee={handleChangeEmployee}
                onChangeWorkingTime={handleChangeWorkingTime}
                onDeleteTimeline={handleDeleteTimeline}
                onEmptyTimeline={handleEmptyTimeline}
                addTimeline={handleAddWorkingTime}
                handleCopyTool={handleCopyTool}
                handleAddHistory={handleAddHistory}
                addEmployee={()=>addTempEmployees(shiftId,employee_Id,jobTypeId,event?.id)}
              />
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-for='user_marker' data-tip={marker && !title ? marker.comment : ''} className={cellClasses} ref={refCell} onClick={handleMarker}>
      {title != 0 ? title : ''}
      <HolidayIcon
        holidays={holiday}
        month={true}
      />
    </div>
  );
};
