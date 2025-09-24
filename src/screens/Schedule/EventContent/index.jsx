import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Dropdown from '../Dropdown';
import { TIMELINE } from '../../../const';
import ReplacedEmployee from './ReplacedEmployee';
import ChangeWorkingTime from './ChangeWorkingTime';
import AddWorkingTime from './AddWorkingTime';
import ChangeEmployee from './ChangeEmployee';
import styles from './EventContent.module.scss';
//import PlaceholderAvatarIcon from "../../../components/Icons/PlaceholderAvatar";
import classNames from 'classnames';
//import { padStart } from '@fullcalendar/react';
import { companyModules } from '../../../store/company/selectors';
import { AdditionalRatesDataSelector,
  currencySelector,
  scheduleSelector,
  settingCompanySelector, IntegrationsDataSelector } from '../../../store/settings/selectors';
import usePermissions from '../../../components/Core/usePermissions';

import TimeOffSymbol1 from '../../../components/Icons/TimeOffSymbol1'
import TimeOffSymbol2 from '../../../components/Icons/TimeOffSymbol2'
import TimeOffSymbol3 from '../../../components/Icons/TimeOffSymbol3'
import TimeOffSymbol4 from '../../../components/Icons/TimeOffSymbol4'
import TimeOffSymbol5 from '../../../components/Icons/TimeOffSymbol5'
import TimeOffSymbol6 from '../../../components/Icons/TimeOffSymbol6'
import TimeOffSymbol7 from '../../../components/Icons/TimeOffSymbol7'
import TimeOffSymbol8 from '../../../components/Icons/TimeOffSymbol8'
import TimeOffSymbol9 from '../../../components/Icons/TimeOffSymbol9'

const DEFAULT_COLOR = '#1685FD'

const AttentionIcon = ({color, ...props}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={19}
      viewBox='0 0 19 19'
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path fill={color} d="M9.5 19a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19Z" />
        <path
          stroke="#fff"
          d="M9.5 18.703A9.203 9.203 0 1 0 9.5.297a9.203 9.203 0 0 0 0 18.406Z"
        />
        <path
          fill="#fff"
          d="M8.996 4.367a.594.594 0 0 1 1.007 0l4.869 7.786a.595.595 0 0 1-.504.909H4.631a.594.594 0 0 1-.504-.909l4.87-7.786Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeWidth={1.2}
          d="M9.5 7.62v1.694"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h19v19H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

const permissionsConfig = [
  {
    name: 'night_rates',
    module: 'night_rates',
  },
];

const convertMinutesToHoursAndMinutes = function(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  // Format the result as "hh:mm"
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
  
  return `${formattedHours}:${formattedMinutes}`;
}

const EventContent = ({
  selectedEvent,
  id,
  shiftId,
  employeeId,
  resourceId,
  //title,
  photo,
  jobTypeName,
  employeeName,
  cost,
  night_minutes,
  break_minutes,
  work_minutes,
  minutes,
  costPermission,
  nightPermission,
  withMenu,
  onChangeEmployee,
  onChangeWorkingTime,
  onDeleteTimeline,
  onEmptyTimeline,
  newEmployee,
  oldEmployee,
  start,
  end,
  viewType,
  copy_event,
  empty,
  empty_manual,
  editPermissions,
  addEmployee,
  addTimeline,
  //dayNumber,
  isCompleted,
  activeDrag,
  unavailableEmployees,
  markers,
  removeTimelines,
  lineColor,
  handleCopyTool,
  copyTool,
  handleAddHistory,
  nightDuration,
  title,
  showHoursCount,
  policies,
}) => {

  const { t } = useTranslation();

  const [content, setContent] = useState('menu');
  const modalRef = useRef(null);
  const modalAddRef = useRef(null);
  const modules = useSelector(companyModules);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  const schedule = useSelector(scheduleSelector);
  const permissions = usePermissions(permissionsConfig);
  const integrations = useSelector(IntegrationsDataSelector);

  const [isShown, setIsShown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (content === 'addWorkingTime') {
      if (modalAddRef.current) {
        modalAddRef.current.open();
      }
    } else {
      if (modalAddRef.current) {
        modalAddRef.current.close();
      }
    }
  }, [content]);

  const classes = classNames(
    styles.eventContent,
    {
      [styles.dayEnd]: isCompleted,
      [styles.eventContent__time]: content === 'addWorkingTime',
      [styles.activeDrag]: activeDrag,
      'activeDrag': activeDrag,
      [styles.eventContent__removeTimelines]: removeTimelines,
      [styles.monthCell]: viewType === TIMELINE.MONTH,
      [styles.cellNoMonth]: viewType !== TIMELINE.MONTH,
    },
  );

  const endOverlap = () => {
    let result = 0
    if (permissions.night_rates && AdditionalRates.night_time && AdditionalRates.night_time_time_start && AdditionalRates.night_time_time_end) {    
      const expl_start = AdditionalRates.night_time_time_start.split(':')
      const expl_end = AdditionalRates.night_time_time_end.split(':')

      if (expl_start.length >= 2 && expl_end.length >= 2) {
          let night_start = moment(start).clone().set({"hour": expl_start[0]*1, "minute": expl_start[1]*1});
          let night_end = moment(start).clone().set({"hour": expl_end[0]*1, "minute": expl_end[1]*1});

          if (night_start.isAfter(night_end)) {
            night_end.add(1, 'days');
          }

          const overlap = overlapInMinutes(moment(start), moment(end), night_start, night_end)/60;

          if (overlap > 0) {
            const duration = moment.duration(moment(end).diff(moment(start)));
            const hours = duration.asHours();

            result = overlap/hours*100;
          }
      }
    }

    return result
  };

  const startOverlap = () => {
    let result = 0
    
    if (permissions.night_rates && AdditionalRates.night_time && AdditionalRates.night_time_time_start && AdditionalRates.night_time_time_end) {    
      const expl_start = AdditionalRates.night_time_time_start.split(':')
      const expl_end = AdditionalRates.night_time_time_end.split(':')

      if (expl_start.length >= 2 && expl_end.length >= 2) {
          let night_start = moment(start).clone().set({"hour": expl_start[0]*1, "minute": expl_start[1]*1});
          let night_end = moment(start).clone().set({"hour": expl_end[0]*1, "minute": expl_end[1]*1});

          if (night_start.isAfter(night_end)) {
            night_start.subtract(1, 'days');
          }

          const overlap = overlapInMinutes(moment(start), moment(end), night_start, night_end)/60;

          if (overlap > 0) {
            const duration = moment.duration(moment(end).diff(moment(start)));
            const hours = duration.asHours();
            
            result = overlap/hours*100;
          }
      }
    }

    return result
  };

  const overlapInMinutes = (startDate1, endDate1, startDate2, endDate2) => {
    // Figure out which is the later start time
    let lastStart = startDate1.isSameOrAfter(startDate2) ? startDate1 : startDate2;

    // Convert that to an integer
    lastStart = lastStart.unix();

    // Figure out which is the earlier end time
    let firstEnd = endDate2.isSameOrAfter(endDate1) ? endDate1 : endDate2;
    // Convert that to an integer
    firstEnd = firstEnd.unix();

    // Subtract the two, divide by 60 to convert seconds to minutes, and round down
    let overlap = Math.floor( (firstEnd - lastStart) / 60 );

    // If the answer is greater than 0 use it.
    // If not, there is no overlap.
    return overlap > 0 ? overlap : 0;
  }

  const openChangeEmployee = () => {
    modalRef.current.open();
    setContent('changeEmployee');
  };
  const openChangeWorkingTime = () => {
    setContent('changeWorkingTime');
  };
  const openCopyMode = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
    setContent('menu');
    handleCopyTool({start, end});
    modalRef.current.close();
  };
  const openAddWorkingTime = () => {
    setContent('addWorkingTime');
  };
  const copyEvent = () => {
    handleAddHistory({resourceId: resourceId, start: moment(start).format('YYYY-MM-DD'), end: moment(start).format('YYYY-MM-DD')});
  };
  const handleCancel = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
    setContent('menu');
  };
  const handleDeleteTimeline = () => {
    onDeleteTimeline({ id, shiftId });
    modalRef.current.close()
  };
  const handleEmptyTimeline = () => {
    onEmptyTimeline({ id, shiftId });
  };
  const handleChangeWorkingTime = (value) => {
    const timeStart = value.start.split(':');
    const timeEnd = value.end.split(':');
    let time;
    if ((timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1])) {
      // night time
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(end).set({ h: timeEnd[0], m: timeEnd[1] }),
      };
    } else {
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(start).set({ h: timeEnd[0], m: timeEnd[1] }),
      };
    }

    onChangeWorkingTime({ id, shiftId, time });
    modalRef.current.close();
  };
  const handleAddWorkingTime = (value) => {
    const timeStart = value.start.split(':');
    const timeEnd = value.end.split(':');
    let time;
    if ((timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1])) {
      // night time
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(end).set({ h: timeEnd[0], m: timeEnd[1] }),
      };
    } else {
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(start).set({ h: timeEnd[0], m: timeEnd[1] }),
      };
    }

    addTimeline({ id, shiftId, time });
    modalAddRef.current.close()
  };
  const handleChangeEmployee = (nextEmployeeId) => {
    onChangeEmployee({
      shiftId,
      employeeId: nextEmployeeId,
      id,
    });
    modalRef.current.close();
  };
  const tooltipType = () => {
    let type = 'time';

    if (start && end && moment().isBetween(start, end)) {
      type += '_active';
    } else if (isCompleted) {
      type += '_past';
    } else if (!newEmployee?.name && (employeeName === 'Empty' || empty)) {
      type += '_empty';
    }
      
    return type;
  }

  const markerComment = () => {
    const current = markers.find(e => moment(e.date).isSame(moment(start), 'day') && e.employee_id === employeeId && e.user_request);
    return current ? current.comment : false;
  }

  

  const currency = useMemo(
    () => {
      if (Array.isArray(currencies)) {
        return currencies
          .find((curr) => curr.code === company?.currency || curr.name === company?.currency)?.symbol ?? '';
      }

      return '';
    },
    [company.currency, currencies],
  )

  const timeOffTooltipContent = (timeOffRequest) => {
    const statusColor = (status => {
      switch(status) {
        case 'approved': return '#34C759'
        case 'pending': return '#FF9500'
        case 'rejected': return '#FF3B30'
        default: return '#34C759'
      }
    })(timeOffRequest.status)

    return `
      <div style="font-size: 13px; display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; gap: 4px;">
          <span style="color: #7c7c7c;">${t('From')}:</span>
          <b style="color: #000;">${timeOffRequest.from}</b>
          <span style="color: #7c7c7c;">${t('To')}:</span>
          <b style="color: #000;">${timeOffRequest.to}</b>
        </div>
        <div style="display: flex; gap: 4px;">
          <span style="color: #7c7c7c;">${t('Policy')}:</span>
          <b style="color: #000;">${timeOffRequest.policy.name}</b>
        </div>
        <div style="display: flex; gap: 4px;">
          <span style="color: #7c7c7c;">${t('Status')}:</span>
          <b style="color: ${statusColor}; text-transform: capitalize;">${timeOffRequest.status}</b>
        </div>
        ${
          timeOffRequest.note
            ? `<div style="display: flex; gap: 4px;">
                <span style="color: #7c7c7c;">${t('Note')}:</span>
                <b style="color: #000;">${timeOffRequest.note}</b>
              </div>`
            : ''
        }
      </div>
    `
  }

  const tooltipContent = () => {
    return (
      `<div class="timeline-tooltip">${t('From')} <b>${moment(start).format('HH:mm')}</b> ${t('to')} <b>${moment(selectedEvent.realEnd).format('HH:mm')}</b><br/>
      ${t('Total Hours')} <b>${convertMinutesToHoursAndMinutes(minutes)}</b>`
      + (nightPermission ? `<br />${t('Work hours')} <b>${convertMinutesToHoursAndMinutes(work_minutes)}</b>` : ``)
      + (schedule.deduct_break || integrations?.iiko ? `<br />${t('Break hours')} <b>${convertMinutesToHoursAndMinutes(break_minutes)}</b>` : ``)
      + (nightPermission ? `<br />${t('Night hours')} <strong>${convertMinutesToHoursAndMinutes(night_minutes)}</strong>` : ``)
      + (costPermission ? `<br />${t('Cost')} <b>${cost}${currency}</b>` : ``)
      + `</div>`
    )
  }

  if (selectedEvent.timeOffRequest && (selectedEvent.timeOffRequest.status === 'approved' || (selectedEvent.timeOffRequest.status === 'pending' && empty_manual))) {
    const policy = policies[selectedEvent.timeOffRequest.policy_id] || {color: DEFAULT_COLOR}
    return (
      <div
        data-tooltip-id="time_off"
        data-tooltip-html={timeOffTooltipContent({...selectedEvent.timeOffRequest, policy: policy})}
        className={styles.timrOffRequest} style={{backgroundColor: policy.color || DEFAULT_COLOR}}>
        {
          ((symbol) => {
            switch(symbol) {
              case '1': return <TimeOffSymbol1 className={styles.policyIcon} width={10} height={20} />
              case '2': return <TimeOffSymbol2 className={styles.policyIcon} width={10} height={20} />
              case '3': return <TimeOffSymbol3 className={styles.policyIcon} width={10} height={20} />
              case '4': return <TimeOffSymbol4 className={styles.policyIcon} width={10} height={20} />
              case '5': return <TimeOffSymbol5 className={styles.policyIcon} width={10} height={20} />
              case '6': return <TimeOffSymbol6 className={styles.policyIcon} width={10} height={20} />
              case '7': return <TimeOffSymbol7 className={styles.policyIcon} width={10} height={20} />
              case '8': return <TimeOffSymbol8 className={styles.policyIcon} width={10} height={20} />
              case '9': return <TimeOffSymbol9 className={styles.policyIcon} width={10} height={20} />
              default: return <TimeOffSymbol1 className={styles.policyIcon} width={10} height={20} />
            }
          })(policy.symbol)
        }
        {
          selectedEvent.timeOffRequest.status === 'pending'
            ? <div className={styles.pendingDot} />
            : null
        }
      </div>
    )
  }

  return (
    <div
      className={classes}
      data-tooltip-id={selectedEvent.timeOffRequest ? 'time_off' : tooltipType()}
      data-tooltip-html={activeDrag || copy_event || copyTool || empty_manual || empty || (employeeName === 'Empty' && !selectedEvent.new_employee?.id) ? null : (selectedEvent.timeOffRequest ? timeOffTooltipContent({...selectedEvent.timeOffRequest, policy: policies[selectedEvent.timeOffRequest.policy_id]}) : tooltipContent())}
      id='dropdownButton'
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {
        selectedEvent.timeOffRequest && !empty_manual
          ? <AttentionIcon
              style={{position: 'absolute', top: 1, right: 0, zIndex: 2, visibility: 'visible'}}
              width={12}
              height={12}
              color={'#FD4646'} />
          : null
      }
      <div style={{display: 'flex', alignItems: 'flex-start', flex: 1, width: '100%'}}>
        { !copy_event && !activeDrag && !empty_manual && endOverlap() > 0 && (
          <div
            className={styles.eventContent__night_end}
            style={{ width: `${endOverlap()}%` }}
          ></div>
          )
        }
        { !copy_event && !activeDrag && !empty_manual && startOverlap() > 0 && (
            <div
              className={styles.eventContent__night_start}
              style={{ width: `${startOverlap()}%` }}
            ></div>
          )
        }
        {/* {
          night_minutes
            ? (
              <div className={styles.eventContent__night_minutes}>
                {convertMinutesToHoursAndMinutes(night_minutes)}
              </div>
            )
            : null
        } */}
        {/* {
          !empty_manual && (
          (!!newEmployee?.name || empty)
            ? (newEmployee?.photo === null || empty)
              ? ''
              :<img
                      alt='avatar'
                      src={newEmployee?.photo}
                      className={styles.eventContent__avatar}
                  />
              :photo && (
              <img
                  alt='avatar'
                  src={photo}
                  className={styles.eventContent__avatar}
              />
        
          )
          )
        } */}
        { !copy_event && removeTimelines && !empty_manual && employeeName !== 'Empty' && !showHoursCount && (
            <div className={styles.eventContent__line} style={{backgroundColor: lineColor}}></div>
          )
        }
        {
            employeeName && !selectedEvent.rId && (
              (empty_manual)
              ? (copyTool)
                ? moment(start).isSameOrAfter(moment().subtract(1, 'day')) ? <span onClick={copyEvent} className={'copy-add'}>{t('Paste the Time')}</span> : null
                : (editPermissions && moment(start).isSameOrAfter(moment().subtract(1, 'day')) && (<span data-tooltip-id={markerComment() ? 'user_marker' : ''}  data-tooltip-html={markerComment() ? markerComment() : ''} onClick={openAddWorkingTime} className={'empty-add'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>))
              : <span className={styles.eventContent__title} >
                {
                  copyTool && <span onClick={copyEvent} className={'copy-add event'}>{t('Paste the Time')}</span>
                }
                {
                  (!!newEmployee?.name)
                    ? showHoursCount
                      ? <span>{minutes / 60}</span>
                      : <>{moment(start).format('HH:mm')}<br />{moment(end).format('HH:mm')}</>
                    : (employeeName === 'Empty' || empty)
                        ? moment(start).isSameOrAfter(moment().subtract(1, 'day')) ? <span data-tooltip-id={markerComment() ? 'user_marker' : ''}  data-tooltip-html={markerComment() ? markerComment() : ''} onClick={addEmployee} className={'empty-add'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : null
                        :<>{moment(start).format('HH:mm')}<br />{moment(end).format('HH:mm')}</>

                  
                }
              </span>
          )
        }

        <div className={styles.eventContent__leftSpace} />
        {
          !copy_event && newEmployee?.name !== oldEmployee?.name && (
            <ReplacedEmployee
              newEmployee={newEmployee}
              oldEmployee={oldEmployee}
              onDelete={handleDeleteTimeline}
              onChangeEmployee={openChangeEmployee}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isShown={isCompleted ? isShown : isOpen}
              isToday={isCompleted}
            />
          )
        }
        {
          content === 'addWorkingTime' && (
            <Dropdown
              cancel={content !== 'menu'}
              onCancel={() => setContent('menu')}
              ref={modalAddRef}
              // buttonClass={styles.eventContent__invisible}
            >
              <AddWorkingTime
                onClose={() => setContent('menu')}
                photo={photo}
                jobTypeName={jobTypeName}
                employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
                start={selectedEvent.defaultTimes.start || start}
                end={selectedEvent.defaultTimes.end || end}
                onChangeTime={handleAddWorkingTime}
              />
            </Dropdown>
          )
        }
        {
          !copy_event && withMenu && !empty && !empty_manual && (employeeName !== 'Empty' || newEmployee?.name) ? (
            <Dropdown
              light
              cancel={content !== 'menu'}
              onCancel={handleCancel}
              ref={modalRef}
            >
              {
                content === 'changeEmployee' && (
                  <ChangeEmployee
                    photo={photo}
                    jobTypeName={jobTypeName}
                    employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
                    onChangeEmployee={handleChangeEmployee}
                    unavailableEmployees={unavailableEmployees}
                  />
                )
              }
              {
                content === 'changeWorkingTime' && (
                  <ChangeWorkingTime
                    photo={photo}
                    jobTypeName={jobTypeName}
                    employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
                    start={start}
                    end={end}
                    onChangeTime={handleChangeWorkingTime}
                  />
                )
              }
              {
                content === 'menu' && (
                  <>
                    <div className={styles.eventContent__userInfo}>
                      {
                        (!!newEmployee?.name || empty)
                          ? (newEmployee?.photo === null || empty)
                            ? ''
                            :<img
                                    alt='avatar'
                                    src={newEmployee?.photo}
                                    className={styles.eventContent__userInfo__avatar}
                                />
                            :photo && (
                            <img
                                alt='avatar'
                                src={photo}
                                className={styles.eventContent__userInfo__avatar}
                            />
                        )
                      }
                      <div className={styles.eventContent__userInfo__right}>
                        <div className={styles.eventContent__userInfo__right__fullName}>
                          {newEmployee?.name ? newEmployee?.name : employeeName}
                        </div>
                        <div className={styles.eventContent__userInfo__right__jobType}>
                          {jobTypeName}
                        </div>
                      </div>
                    </div>
                    <div className={styles.eventContent__label}>
                      {t('Working Time')}
                    </div>
                    <div className={styles.eventContent__value}>
                      {`${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`}
                    </div>
                    {/* Edgaras suggestion 2022-05-25 FOR REMOVE */}
                    {/* Edgaras suggestion 2025-04-17 FOR RETURN */}
                    {/* { !modules.manual_mode && ( */}
                    <Dropdown.ItemMenu
                      title={t('Change Employee')}
                      onClick={openChangeEmployee}
                    />
                    <Dropdown.ItemMenu
                      title={t('Change Working Time')}
                      onClick={openChangeWorkingTime}
                    />
                    { modules.manual_mode ? (
                      <Dropdown.ItemMenu
                        title={t('Run Copy Mode')}
                        onClick={openCopyMode}
                      />
                      ) : null
                    }
                    { !modules.manual_mode ? (
                        <Dropdown.ItemMenu
                          title={t('Empty Timeline')}
                          onClick={handleEmptyTimeline}
                          remove
                        />
                      ) : (
                        <Dropdown.ItemMenu
                          title={t('Delete Timeline')}
                          onClick={handleDeleteTimeline}
                          remove
                        />
                      )
                    }
                  </>
                )
              }
              <div className={styles.eventContent__space} />
            </Dropdown>
          ) : (
            <div className={styles.eventContent__rightSpace} />
          )
        }
      </div>
      
      {
        nightDuration && !empty_manual && title && employeeName !== 'Empty'
          ? <div style={{width: '100%', borderLeft: '3px solid #db894f', color: '#333945', fontSize: 11}}>
              { nightDuration }h
            </div>
          : null
      }
    </div>
  );

};

export default React.memo(EventContent, (prevProps, nextProps) => {
  return prevProps.copyTool === nextProps.copyTool && prevProps.title === nextProps.title && prevProps.start === nextProps.start && prevProps.end === nextProps.end
})

