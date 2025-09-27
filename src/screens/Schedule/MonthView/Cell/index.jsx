import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import HolidayIcon from '../../../../components/Core/HolidayIcon/HolidayIcon';
import CellOptions from '../CellOptions';
import moment from 'moment';

import classes from './Cell.module.scss';
import { AdditionalRatesDataSelector,
  currencySelector,
  scheduleSelector,
  settingCompanySelector, IntegrationsDataSelector } from '../../../../store/settings/selectors';
import { userSelector } from '../../../../store/auth/selectors';

const convertMinutesToHoursAndMinutes = function(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // Format the result as "hh:mm"
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
  
  return `${formattedHours}:${formattedMinutes}`;
}

const Cell = ({
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
  currentMonth,
}) => {
  
  const { t } = useTranslation();
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};
  const schedule = useSelector(scheduleSelector);
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);
  const integrations = useSelector(IntegrationsDataSelector);
  const user = useSelector(userSelector);

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
    // [classes.cell_header]: header && !markerActive,
    [classes.cell_marker]: marker && !title,
    [classes.cell_marker_active]: markerActive && !header,
    [classes.cell_today]: today,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
    [classes.cell_start_finish]: (scheduleSettings?.start_finish && startFinish),
  });

  const editCellPermissions = useMemo(() => {
    //check if user can control place or jobtype
    const place_id = event?.place_id;
    const splited = event?.resourceId?.toString().split('-');
    const job_type_id = splited && splited[1] ? splited[1] : null;
    const shift_id = splited && splited[0] ? splited[0] : null;
    if (user?.employee?.place?.[0]?.id) {
      if (place_id && user?.employee?.place?.[0]?.id.toString() === place_id.toString()) {
        if (user?.employee?.shift_id) {
          if (shift_id && user?.employee?.shift_id.toString() === shift_id.toString()) {
            if (user?.employee?.job_type_id) {
              if (job_type_id && user?.employee?.job_type_id.toString() === job_type_id.toString()) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          } else {
            return false;
          }
        } else {
          return true;
        }
      } else {
        return false
      }
    }

    return permissions?.schedule_create_and_edit

  }, [permissions, event, user?.user?.id]);

  
  
  // useEffect(() => {
  //   if (!header && title) {
  //     if (refCell.current.scrollWidth >= refCell.current.offsetWidth) {
  //       refCell.current.classList.add(classes.cell_doesNotFit);
  //       refCell.current.firstChild.style.maxWidth = `${refCell.current.offsetWidth}px`;
  //     }
  //   }
  // }, [title]);

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

  let shiftId;
  let employee_Id;
  let employeeName;
  let withMenu = false;
  let isCompleted = event?.is_completed;
  let jobTypeId;

  if (resource?.employeeId || resource?.employeeId*1 === 0) {
    [shiftId, jobTypeId] = resource.id.split('-');
    withMenu = event ? true : false;
    employeeName = resource.title;
    employee_Id = resource.employeeId
    shiftId = resource.shift_id ? resource.shift_id : shiftId
  }

  let unEmployees = [];
  if (event) {
    const allEmployees  = events.filter(e => e.empty_employee === false
      // eslint-disable-next-line
                                                    && e.resourceId.indexOf(shiftId+'-') == 0
                                                    // eslint-disable-next-line
                                                    && event.day_number == e.day_number);

    unEmployees = allEmployees.map(e => {
      if (e?.new_employee?.id) {
        return e?.new_employee?.id*1;
      }

      return e.employee_id*1;
    });
  }

  

  const tooltipContent = () => {
    return (
      !event ? `${title} ${t('hours')}` : (
      `<div class="timeline-tooltip">${t('From')} <b>${moment(event.start).format('HH:mm')}</b> ${t('to')} <b>${moment(event.end).format('HH:mm')}</b><br/>
      ${t('Total Hours')} <b>${convertMinutesToHoursAndMinutes(event.minutes)}</b>`
      + ((permissions.night_rates && AdditionalRates.night_time) ? `<br />${t('Work hours')} <b>${convertMinutesToHoursAndMinutes(event.work_minutes)}</b>` : ``)
      + (schedule.deduct_break || integrations?.iiko ? `<br />${t('Break hours')} <b>${convertMinutesToHoursAndMinutes(event.break_minutes)}</b>` : ``)
      + ((permissions.night_rates && AdditionalRates.night_time) ? `<br />${t('Night hours')} <strong>${convertMinutesToHoursAndMinutes(event.night_minutes)}</strong>` : ``)
      + ((permissions.cost && permissions.schedule_costs) ? `<br />${t('Cost')} <b>${event.cost}${currency}</b>` : ``)
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
    } else if (!event?.new_employee?.name && (employeeName === 'Empty' || event?.empty_event)) {
      type += '_empty';
    }
      
    return type;
  }

  return (
    <div className={cellClasses}>
      <div className={classes.cell__content} data-title={title ? title : null}>
        <div
          data-tooltip-id={tooltipType()}
          data-tooltip-html={title && !copyTool && !event?.empty_manual ? tooltipContent() : null}
          onClick={handleMarker}
          className={classnames(classes.cell__content__text, {[classes.cell__content__text_time]: scheduleSettings?.start_finish && startFinish})}
        >
          { title && !event?.empty_manual ? (
              <span className={classes.cell_day} style={{borderColor: borderColor ? borderColor : null}}dangerouslySetInnerHTML={{ __html: scheduleSettings?.start_finish && startFinish ? startFinish.replace('-', '<br />') : title }} />
            ) : null
          }
          {
            (title && !event?.empty_manual) && night_duration && night_duration > 0 ? (
              <span className={classes.cell_night}>
                {night_duration}h
              </span>
            ) : null
          }

          { !statistic && !markerActive &&
            <CellOptions
              id={event?.id}
              currentDay={currentDay}
              currentMonth={currentMonth}
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
              withMenu={withMenu && !copyTool && editCellPermissions}
              editPermissions={editCellPermissions}
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
  )
};

const CellHeader = ({title, marker, statistic, past, weekend, markerActive, today, scheduleSettings, startFinish, holiday, handleMarker}) => {
  const { t } = useTranslation();
  const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};
  const cellClasses = classnames(classes.cell, 'monthCell', {
    [classes.cell_statistic]: statistic,
    [classes.cell_weekend]: weekend,
    [classes.cell_past]: past,
    [classes.cell_header]: !markerActive,
    [classes.cell_marker]: marker && !title,
    [classes.cell_today]: today,
    //[classes.cell_holiday]: h.date ? true : false,
    [classes.cell_holiday_company]: h.company_work_time_id ? true : false,
    [classes.cell_holiday_government]: (h.date && !h.company_work_time_id) ? true : false,
    [classes.cell_start_finish]: (scheduleSettings?.start_finish && startFinish),
  });

  const isDate = !isNaN(title)

  return (
    <div data-tooltip-id='user_marker' data-tooltip-html={marker && !title ? marker.comment : ''} className={cellClasses} onClick={isDate ? handleMarker : null}>
      {isDate ? <span>{t('Go')}</span> : null}
      { title }
      {isDate ? <HolidayIcon holidays={holiday} month={true} /> : null}
    </div>
  )
}

const CellMemo = (props) => {
  if (!props.firstRenderFinished) {
    return null
  }

  return (
    <div style={{flex: props.statistic ? 2 : 1, gridColumn: props.statistic ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column'}}>
      {
        props.header ? <CellHeader {...props} /> : <Cell {...props} />
      }
    </div>
  )
}

export default CellMemo


// export default React.memo(CellMemo, (prevProps, nextProps) => {
//   return _.isEqual(prevProps.title, nextProps.title) &&
//   _.isEqual(prevProps.startFinish, nextProps.startFinish) &&
//   _.isEqual(prevProps.statistic, nextProps.statistic) &&
//   _.isEqual(prevProps.weekend, nextProps.weekend) &&
//   _.isEqual(prevProps.past, nextProps.past) &&
//   _.isEqual(prevProps.marker, nextProps.marker) &&
//   _.isEqual(prevProps.today, nextProps.today) &&
//   _.isEqual(prevProps.header, nextProps.header) &&
//   _.isEqual(prevProps.holiday, nextProps.holiday) &&
//   _.isEqual(prevProps.night_duration, nextProps.night_duration) &&
//   _.isEqual(prevProps.markerActive, nextProps.markerActive) &&
//   _.isEqual(prevProps.scheduleSettings, nextProps.scheduleSettings) &&
//   _.isEqual(prevProps.borderColor, nextProps.borderColor) &&
//   _.isEqual(prevProps.event, nextProps.event) &&
//   _.isEqual(prevProps.copyTool, nextProps.copyTool) &&
//   _.isEqual(prevProps.workTime, nextProps.workTime) &&
//   _.isEqual(prevProps.resource, nextProps.resource) &&
//   _.isEqual(prevProps.permissions, nextProps.permissions) &&
//   _.isEqual(prevProps.events, nextProps.events) &&
//   _.isEqual(prevProps.markers, nextProps.markers) &&
//   _.isEqual(prevProps.currentDay, nextProps.currentDay) &&
//   _.isEqual(prevProps.currentMonth, nextProps.currentMonth) &&
//   _.isEqual(prevProps.handleMarker, nextProps.handleMarker)
// })