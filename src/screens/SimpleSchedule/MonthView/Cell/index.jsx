import React, { useRef, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
//import { useSelector } from 'react-redux';
import classnames from 'classnames';
import HolidayIcon from '../../../../components/Core/HolidayIcon/HolidayIcon';
import CellOptions from '../CellOptions';
import moment from 'moment';
import { useSelector } from 'react-redux';

import classes from './Cell.module.scss';
import {
  AdditionalRatesDataSelector,
  currencySelector,
  //scheduleSelector,
  settingCompanySelector,
  //IntegrationsDataSelector
  employeesSelector,
} from '../../../../store/settings/selectors';

const Cell = ({
  title,
  startFinish,
  statistic,
  events,
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
  workTime,
  resource,
  permissions,
  handleEmptyTimeline,
  handleEditWorkingTime,
  handleDuplicateEmployee,
  handleDeleteWorkingTime,
  handleAddTask,
  openAddSchedule,
  onEditReccuring,
  onDeleteReccuring,
  availableEmployees,
}) => {
  const { t } = useTranslation();
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);
  const { users: employees } = useSelector(employeesSelector);
  //const integrations = useSelector(IntegrationsDataSelector);

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
  
  const cellClasses = classnames(classes.cell, 'monthCell', {
    [classes.cell_statistic]: statistic,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_header]: header && !markerActive,
    [classes.cell_marker]: marker && !title,
    [classes.cell_marker_active]: markerActive && !header,
    [classes.cell_today]: today,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
    [classes.cell_start_finish]: (scheduleSettings?.start_finish && startFinish),
  });

  const refCell = useRef();

  let start = event ? moment(event.start) : null;
  let end = event ? moment(event.end) : null;

  if (event?.empty_manual && start && end && workTime?.work_time?.work_days?.days) {
    // eslint-disable-next-line
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

  let employee_Id = event?.employee_id;
  let employeeName = event?.employee_name;
  let withMenu = event?.employee_id ? true : false;
  const isCompleted = event?.is_completed;

  const unEmployees = useMemo(() => {
    if (availableEmployees && availableEmployees.length) {
      return employees.filter(e => !availableEmployees.includes(e.id)).map(e => e.id);
    }
    
    return [];
  }, [availableEmployees, employees]);


  const convertMinutesToHoursAndMinutes = function(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    // Format the result as "hh:mm"
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
    
    return `${formattedHours}:${formattedMinutes}`;
  }

  

  const tooltipContent = () => {
    

    let tooltip_start = moment(event.start);
    let tooltip_end = moment(event.end);
    let minutes = event.minutes;
    let work_minutes = event.work_minutes;
    let night_minutes = event.night_minutes;
    if (event?.group) {
      minutes = 0;
      work_minutes = 0;
      night_minutes = 0;
      event.group.forEach(g => {
        if (g.start && moment(g.start).isBefore(tooltip_start)) {
          tooltip_start = moment(g.start);
        }
        if (g.end && moment(g.end).isAfter(tooltip_end)) {
          tooltip_end = moment(g.end);
        }

        minutes += g.minutes;
        work_minutes += g.work_minutes;
        night_minutes += g.night_minutes;
      });
    }
    if (statistic) {
      const resourceEvents = events?.filter((ev) => ev?.resourceId === resource?.id) || []
      const stats = resourceEvents.reduce((acc, e) => {
        return {
          minutes: acc.minutes + (e?.minutes || 0),
          work_minutes: acc.work_minutes + (e?.work_minutes || 0),
          night_minutes: acc.night_minutes + (e?.night_minutes || 0),
        }
      }, {
        minutes: 0,
        work_minutes: 0,
        night_minutes: 0,
      })
      minutes = stats.minutes
      work_minutes = stats.work_minutes
      night_minutes = stats.night_minutes
    }

    return (
      !event ? `${title} ${t('hours')}` : (
      `<div class="timeline-tooltip">${t('From')} <b>${tooltip_start.format('HH:mm')}</b> ${t('to')} <b>${moment(tooltip_end).format('HH:mm')}</b><br/>
      ${t('Total Hours')} <b>${convertMinutesToHoursAndMinutes(minutes)}</b>`
      + ((permissions.night_rates && AdditionalRates.night_time) ? `<br />${t('Work hours')} <b>${convertMinutesToHoursAndMinutes(work_minutes)}</b>` : ``)
      //+ (schedule.deduct_break || integrations?.iiko ? `<br />${t('Break hours')} <b>${convertMinutesToHoursAndMinutes(event.break_minutes)}</b>` : ``)
      + ((permissions.night_rates && AdditionalRates.night_time) ? `<br />${t('Night hours')} <strong>${convertMinutesToHoursAndMinutes(night_minutes)}</strong>` : ``)
      + ((permissions.cost && permissions.schedule_costs) ? `<br />${t('Cost')} <b>${event.cost}${currency}</b>` : ``)
      + (event?.group ? `<br />${t('Tasks')}: ${event?.group.length}/${event?.group.filter(g => g.is_finished).length}` : ``)
      + `</div>`
      )
    )
  }

  const tooltipType = () => {
    let type = 'time';
    
    if (start && end && moment().isBetween(start, end)) {
      type += '_active';
    } else if (isCompleted) {
      type += '_past';
    }
    
    return type;
  }

  
  
  if (!header) {
    return (
      <div className={cellClasses} ref={refCell}>
        <div className={classes.cell__content} data-title={title ? title : null}>
          <div
            data-tooltip-id={tooltipType()}
            data-tooltip-html={title ? tooltipContent() : null}
            onClick={handleMarker}
            className={classnames(classes.cell__content__text, {[classes.cell__content__text_time]: scheduleSettings?.start_finish && startFinish})}
          >
            { title ? (
                <span className={classes.cell_day} style={{borderColor: borderColor ? borderColor : '#2775D0'}}dangerouslySetInnerHTML={{ __html: scheduleSettings?.start_finish && startFinish ? startFinish.replace('-', '<br />') : title }} />
              ) : null
            }
            {
              title && night_duration && night_duration > 0 ? (
                <span className={classes.cell_night}>
                  {night_duration}h
                </span>
              ) : null
            }
            {
              title && event?.group && employee_Id ? (
                <span className={classnames(classes.cell_tasks, {[classes.cell_tasks_completed]: event?.group.filter(g => g.is_finished).length === event?.group.length})}>
                  {event?.group.length}/<span className={classnames(classes.cell_tasks_finished, {[classes.cell_tasks_finished_green]: event?.group.filter(g => g.is_finished).length > 0})}>{event?.group.filter(g => g.is_finished).length}</span>
                </span>
              ) : null
            }

            { !statistic && !markerActive &&
              <CellOptions
                id={event?.id}
                empty={event?.empty_event}
                copy_event={event?.copy_event}
                title={event?.real_title || null}
                reccuring={event?.reccuring || null}
                description={event?.description || null}
                schedule_title={event?.schedule_title || null}
                group={event?.group || null}
                start={start}
                end={end}
                worked_start={event?.worked_start}
                worked_end={event?.worked_end}
                employeeName={employeeName}
                photo={resource?.photo}
                jobTypeName={event?.job_type_name}
                skillName={resource?.skill_name}
                withMenu={withMenu}
                editPermissions={permissions?.schedule_create_and_edit}
                isCompleted={isCompleted}
                isFisnihed={event?.is_finished}
                onEmptyTimeline={handleEmptyTimeline}
                onEditWorkingTime={handleEditWorkingTime}
                onDuplicateEmployee={handleDuplicateEmployee}
                onDeleteWorkingTime={handleDeleteWorkingTime}
                onAddTask={handleAddTask}
                openAddSchedule={() => { openAddSchedule(event) }}
                onEditReccuring={onEditReccuring}
                onDeleteReccuring={onDeleteReccuring}
                unavailableEmployees={unEmployees}
              />
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    { title*1 > 0 ? 
     (
      <div data-tooltip-id='user_marker' data-tooltip-html={marker && !title ? marker.comment : ''} className={cellClasses} ref={refCell} onClick={handleMarker}>
      <span>{t('Go')}</span>
      {title*1 !== 0 ? title : ''}
      <HolidayIcon
        holidays={holiday}
        month={true}
      />
      </div>
     ) :
     (
      <div data-tooltip-id='user_marker' data-tooltip-html={marker && !title ? marker.comment : ''} className={cellClasses} ref={refCell}>
      {title*1 !== 0 ? title : ''}
      </div>
     )
    }
    </>
  );
};

const isEqual = (prevProps, nextProps) => {
  return prevProps.title === nextProps.title && prevProps.scheduleSettings === nextProps.scheduleSettings
};

export default memo(Cell, isEqual)

