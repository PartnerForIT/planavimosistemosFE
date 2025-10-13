import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Dropdown from '../Dropdown';
import Content from '../Dropdown/Content';
import ChangeEmployee from './ChangeEmployee';
import MenuContent from './MenuContent';
import ReccuringArrows from '../../../components/Icons/ReccuringArrows';
import GroupIcon from '../../../components/Icons/group_icon.png';
import GroupIconBlue from '../../../components/Icons/group_icon_blue.png';
import CommentIcon from '../../../components/Icons/comment_icon.png';
import styles from './EventContent.module.scss';
//import PlaceholderAvatarIcon from "../../../components/Icons/PlaceholderAvatar";
import classNames from 'classnames';
//import { padStart } from '@fullcalendar/react';
import { AdditionalRatesDataSelector,
  currencySelector,
  //scheduleSelector,
  settingCompanySelector,
  //IntegrationsDataSelector
} from '../../../store/settings/selectors';
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

export default ({
  id,
  employeeId,
  resourceId,
  title,
  reccuring,
  photo,
  jobTypeName,
  skillName,
  employeeName,
  group,
  empty,
  cost,
  night_minutes,
  work_minutes,
  minutes,
  costPermission,
  nightPermission,
  editPermission,
  withMenu,
  unavailableEmployees,
  onDuplicateEmployee,
  onDeleteWorkingTime,
  onAddTask,
  onEditWorkingTime,
  start,
  end,
  worked_start,
  worked_end,
  isCompleted,
  isFisnihed,
  handleAddHistory,
  description,
  schedule_title,
  removeTimelines,
  lineColor,
  openAddSchedule,
  onEditReccuring,
  onDeleteReccuring,
  selectedEvent,
}) => {
  const { t } = useTranslation();

  const [content, setContent] = useState('menu');
  const modalRef = useRef(null);
  const modalAddRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const AdditionalRates = useSelector(AdditionalRatesDataSelector);
  const currencies = useSelector(currencySelector);
  const company = useSelector(settingCompanySelector);
  //const schedule = useSelector(scheduleSelector);
  const permissions = usePermissions(permissionsConfig);
  //const integrations = useSelector(IntegrationsDataSelector);
  const [openedGroup, setOpenedGroup] = useState(false);
  const [activeGroupItem, setActiveGroupItem] = useState(null);

  const classes = classNames(
    styles.eventContent,
    {
      //[styles.dayEnd]: isCompleted,
      [styles.eventContent__removeTimelines]: removeTimelines,
    },
  );

  const getGroupItemClasses = (item) => {
    return classNames(
      styles.eventContent__groupModal__item,
      {
        [styles.eventContent__groupModal__item_completed]: item.is_finished,
      },
    );
  }

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

  useEffect(() => {
    const handleOuterDropdownClick = (e) => {
      if (dropdownRef && dropdownRef.current
          && ((dropdownRef.current.contains(e.target)
              || (buttonRef.current && buttonRef.current.contains(e.target))))
      ) {
        return;
      }
      setOpenedGroup(false);
    };
    document.addEventListener('mousedown', handleOuterDropdownClick, false);

    return () => {
      document.removeEventListener('mousedown', handleOuterDropdownClick, false);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (modalAddRef.current) {
      modalAddRef.current.close();
    }
  }, [content]);

  const handleEditWorkingTime = () => {
    onEditWorkingTime(activeGroupItem?.id ? activeGroupItem?.id : id, moment(activeGroupItem?.start ? activeGroupItem?.start : start));
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
  const handleAddTask = () => {
    onAddTask(id);
  };
  const handleDeleteWorkingTime = () => {
    onDeleteWorkingTime(activeGroupItem?.id ? activeGroupItem?.id : id, moment(activeGroupItem?.start ? activeGroupItem?.start : start));
  };
  const handleDuplicateWorkingTime = (employeeId) => {
    onDuplicateEmployee(activeGroupItem?.id ? activeGroupItem?.id : id, employeeId, moment(activeGroupItem?.start ? activeGroupItem?.start : start));
  };
  const handleClickGroupItem = (index) => {
    setActiveGroupItem(group[index]);
    if (modalRef.current) {
      modalRef.current.open();
    }
  }
  
  const tooltipType = () => {
    let type = 'time';

    if (start && end && moment().isBetween(start, end)) {
      type += '_active';
    } else if (isCompleted) {
      //type += '_past';
    }
      
    return type;
  }

  const convertMinutesToHoursAndMinutes = function(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    // Format the result as "hh:mm"
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
    
    return `${formattedHours}:${formattedMinutes}`;
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
  );
  
  const tooltipContent = () => {
    let tooltip_start = moment(start);
    let tooltip_end = moment(end);
    let tooltip_minutes = minutes;
    let tooltip_work_minutes = work_minutes;
    let tooltip_night_minutes = night_minutes;
    
    if (group && employeeId) {
      tooltip_minutes = 0;
      tooltip_work_minutes = 0;
      tooltip_night_minutes = 0;
      group.forEach(g => {
        if (g.start && moment(g.start).isBefore(tooltip_start)) {
          tooltip_start = moment(g.start);
        }
        if (g.end && moment(g.end).isAfter(tooltip_end)) {
          tooltip_end = moment(g.end);
        }

        tooltip_minutes += g.minutes;
        tooltip_work_minutes += g.work_minutes;
        tooltip_night_minutes += g.night_minutes;
      });
    }

    return (
      `<div class="timeline-tooltip">${t('From')} <b>${tooltip_start.format('HH:mm')}</b> ${t('to')} <b>${tooltip_end.format('HH:mm')}</b><br/>
      ${t('Total Hours')} <b>${convertMinutesToHoursAndMinutes(tooltip_minutes)}</b>`
      + (nightPermission ? `<br />${t('Work hours')} <b>${convertMinutesToHoursAndMinutes(tooltip_work_minutes)}</b>` : ``)
      //+ (schedule.deduct_break || integrations?.iiko ? `<br />${t('Break hours')} <b>${convertMinutesToHoursAndMinutes(break_minutes)}</b>` : ``)
      + (nightPermission ? `<br />${t('Night hours')} <strong>${convertMinutesToHoursAndMinutes(tooltip_night_minutes)}</strong>` : ``)
      + (costPermission ? `<br />${t('Cost')} <b>${cost}${currency}</b>` : ``)
      + (group && employeeId ? `<br />${t('Tasks')}: ${group.length}/${group.filter(g => g.is_finished).length}` : ``)
      + `</div>`
    )
  }

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

  const groupStart = () => {
    let start = moment(group[0].start);
    for (let i = 1; i < group.length; i++) {
      if (moment(group[i].start).isBefore(start)) {
        start = moment(group[i].start);
      }
    }

    return start.format('HH:mm');
  }

  const groupEnd = () => {
    let end = moment(group[0].end);
    for (let i = 1; i < group.length; i++) {
      if (moment(group[i].end).isAfter(end)) {
        end = moment(group[i].end);
      }
    }

    return end.format('HH:mm');
  }

  if (selectedEvent.timeOffRequest && (selectedEvent.timeOffRequest.status === 'approved' || (selectedEvent.timeOffRequest.status === 'pending' && empty))) {
    const policy = selectedEvent.timeOffRequest.policy
    return (
      <div
        data-tooltip-id="time"
        data-tooltip-html={timeOffTooltipContent(selectedEvent.timeOffRequest)}
        className={styles.timrOffRequest} style={{backgroundColor: policy.color || DEFAULT_COLOR, opacity: isCompleted ? 0.5 : 1}}>
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
      data-tooltip-id={selectedEvent.timeOffRequest ? 'time' : tooltipType()}
      data-tooltip-html={empty ? null : (selectedEvent.timeOffRequest ? timeOffTooltipContent(selectedEvent.timeOffRequest) : tooltipContent())}
      id='dropdownButton'
    >
      {
        selectedEvent.timeOffRequest && !empty
          ? <AttentionIcon
              style={{position: 'absolute', top: 1, right: 0, zIndex: 2, visibility: 'visible'}}
              width={12}
              height={12}
              color={'#FD4646'} />
          : null
      }
      { endOverlap() > 0 && (
          <div
            className={styles.eventContent__night_end}
            style={{ width: `${endOverlap()}%` }}
          ></div>
        )
      }
      { startOverlap() > 0 && (
          <div
            className={styles.eventContent__night_start}
            style={{ width: `${startOverlap()}%` }}
          ></div>
        )
      }
      { removeTimelines && !empty && (
          <div className={styles.eventContent__line} style={{backgroundColor: lineColor}}></div>
        )
      }
      {
        !group && reccuring &&
        <div className={styles.eventContent__reccuring}>
          <ReccuringArrows />
        </div>
      }
      {
        employeeId && (
          empty ?
            editPermission && <span onClick={openAddSchedule} className={'empty-add'} style={{color: '#000'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          : (group ? (
            <span className={styles.eventContent__group}
              onClick={() => setOpenedGroup(!openedGroup)}
              ref={buttonRef}
            >
              <div className={styles.eventContent__group_icon} >
                <img src={!removeTimelines ? GroupIcon : GroupIconBlue} alt={employeeName} />
              </div>
              <div className={styles.eventContent__group_title} >
                {removeTimelines ? (
                  <span className={styles.eventContent__title}>
                    {groupStart()}
                    <br />
                    {groupEnd()}
                  </span>
                ) : (
                  <>
                    {group.length} {t('tasks')}
                  </>
                )}
              </div>
            </span>
            ) : (
              removeTimelines ? (
                <span className={styles.eventContent__title} >{moment(start).format('HH:mm')}<br />{moment(end).format('HH:mm')}</span>
                ) : (
                <span className={styles.eventContent__title} >
                  { title?.place && <span className={styles.eventContent__place}>{title.place}</span> }
                  { title?.job_type && <span className={styles.eventContent__job_type}>{title.job_type}</span> }
                </span>
              )
            )
          )
        )
      }

      <div className={styles.eventContent__leftSpace} />
      { openedGroup && (
        <Content
          onClose={() => setOpenedGroup(false)}
          wrapperRef={dropdownRef}
          offset={buttonRef.current.getBoundingClientRect()}
          onTop
        >
          <div className={styles.eventContent__groupModal}>
            <div className={styles.eventContent__userInfo}>
              { photo &&
                <div className={styles.eventContent__photo}>
                  <img src={photo} alt={employeeName} /> 
                </div>
              }
              <div className={styles.eventContent__userInfo__right}>
                <div className={styles.eventContent__userInfo__right__fullName}>
                  {employeeName}
                </div>
                <div className={styles.eventContent__userInfo__right__jobType}>
                  {skillName}
                </div>
              </div>
            </div>
            <div className={styles.eventContent__groupModal__count}>
              { group.length } { t('tasks') }
            </div>

            <div className={styles.eventContent__groupModal__list}>
              {
                group.map((item, index) => (
                  <div key={index} className={getGroupItemClasses(item)} onClick={() => handleClickGroupItem(index)}>
                    <div className={styles.eventContent__groupModal__item__title}>
                      { item.reccuring && <div className={styles.eventContent__reccuring}><ReccuringArrows /></div> }
                      {item.schedule_title ? item.schedule_title : ''}
                    </div>
                    <div className={styles.eventContent__groupModal__item__time}>{moment(item.start).format('HH:mm')} - {moment(item.end).format('HH:mm')}{item.title?.job_type ? ` • ${item.title?.job_type}` : ''}</div>
                    { item.title?.place && <div className={styles.eventContent__groupModal__item__place}>{item.title?.place}</div> }

                    { item.description ? 
                      <div className={styles.eventContent__comment_icon} >
                        <img src={CommentIcon} alt={employeeName} />
                      </div>
                      : null
                    }
                  </div>
                ))
              }
            </div>

            { !moment(start).isBefore(moment().startOf('day')) && (
              <div className={styles.eventContent__groupModal__add}>
                <span onClick={handleAddTask}>{t('Add additional task')}</span>
              </div>
            )}
          </div>
        </Content>
      )}
      {
        withMenu && !empty && editPermission && employeeId ? (
          <Dropdown
            light
            green={activeGroupItem ? activeGroupItem.is_finished : isFisnihed}
            cancel={content !== 'menu'}
            onCancel={handleCancel}
            ref={modalRef}
            buttonClass={group ? styles.eventContent__invisible : null}
          >
            {
              content === 'duplicateEmployee' && (
                <ChangeEmployee
                  photo={photo}
                  jobTypeName={activeGroupItem ? activeGroupItem.job_type_name : jobTypeName}
                  skillName={skillName}
                  employeeName={employeeName}
                  onChangeEmployee={handleDuplicateWorkingTime}
                  unavailableEmployees={unavailableEmployees}
                />
              )
            }
            {
              content === 'menu' && (
                <MenuContent
                  reccuring={activeGroupItem ? activeGroupItem.reccuring : reccuring}
                  photo={photo}
                  isCompleted={activeGroupItem ? activeGroupItem.is_completed : isCompleted}
                  isFinished={activeGroupItem ? activeGroupItem.is_finished : isFisnihed}
                  employeeName={employeeName}
                  jobTypeName={activeGroupItem ? activeGroupItem.job_type_name : jobTypeName}
                  skillName={skillName}
                  description={activeGroupItem ? activeGroupItem.description : description}
                  schedule_title={activeGroupItem ? activeGroupItem.schedule_title : schedule_title}
                  start={activeGroupItem ? activeGroupItem.start : start}
                  end={activeGroupItem ? activeGroupItem.end : end}
                  worked_start={activeGroupItem ? activeGroupItem.worked_start : worked_start}
                  worked_end={activeGroupItem ? activeGroupItem.worked_end : worked_end}
                  title={activeGroupItem ? activeGroupItem.title : title}
                  handleEditWorkingTime={handleEditWorkingTime}
                  handleDuplicateWorkingTime={() => setContent('duplicateEmployee')}
                  handleDeleteWorkingTime={handleDeleteWorkingTime}
                  handleAddTask={handleAddTask}
                  onEditReccuring={() => { onEditReccuring(activeGroupItem?.id ? activeGroupItem?.id : id) }}
                  onDeleteReccuring={() => { onDeleteReccuring(activeGroupItem?.id ? activeGroupItem?.id : id) }}
                />
              )
            }
            <div className={styles.eventContent__space} />
          </Dropdown>
        ) : (
          <div className={styles.eventContent__rightSpace} />
        )
      }
    </div>
  );

};

