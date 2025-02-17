import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-tooltip';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Dropdown from '../Dropdown';
import Content from '../Dropdown/Content';
import ChangeEmployee from './ChangeEmployee';
import MenuContent from './MenuContent';
import RefreshArrows from '../../../components/Icons/RefreshArrows';
import GroupIcon from '../../../components/Icons/group_icon.png';
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
  break_minutes,
  work_minutes,
  minutes,
  costPermission,
  nightPermission,
  editPermission,
  withMenu,
  onDuplicateEmployee,
  onDeleteWorkingTime,
  onEditWorkingTime,
  start,
  end,
  worked_start,
  worked_end,
  viewType,
  copy_event,
  isCompleted,
  isFisnihed,
  copyTool,
  handleAddHistory,
  description,
  schedule_title,
  removeTimelines,
  lineColor,
  openAddSchedule,
  onEditReccuring,
  onDeleteReccuring
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

  useEffect(() => {
    Tooltip.rebuild();
  });

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
        [styles.eventContent__groupModal__item_completed]: item.is_completed,
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
  
  return (
    <div
      className={classes}
      data-for={tooltipType()}
      data-html={true}
      data-tip={copy_event || copyTool || empty ? null : tooltipContent()}
      id='dropdownButton'
    >
      { !copy_event && endOverlap() > 0 && (
          <div
            className={styles.eventContent__night_end}
            style={{ width: `${endOverlap()}%` }}
          ></div>
        )
      }
      { !copy_event && startOverlap() > 0 && (
          <div
            className={styles.eventContent__night_start}
            style={{ width: `${startOverlap()}%` }}
          ></div>
        )
      }
      { !copy_event && removeTimelines && !empty && (
          <div className={styles.eventContent__line} style={{backgroundColor: lineColor}}></div>
        )
      }
      {
        !group && reccuring &&
        <div className={styles.eventContent__reccuring}>
          <RefreshArrows />
        </div>
      }
      {
        employeeId && (
          empty ?
            editPermission && <span onClick={openAddSchedule} className={'empty-add'}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          : (group ? (
            <span className={styles.eventContent__group}
              onClick={() => setOpenedGroup(!openedGroup)}
              ref={buttonRef}
            >
              <div className={styles.eventContent__group_icon} >
                <img src={GroupIcon} alt={employeeName} />
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
                  {
                    copyTool && <span onClick={copyEvent} className={'copy-add event'}>{t('Paste the Time')}</span>
                  }

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
                      { item.reccuring && <div className={styles.eventContent__reccuring}><RefreshArrows /></div> }
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
          </div>
        </Content>
      )}
      {
        !copy_event && withMenu && !empty && editPermission && employeeId ? (
          <Dropdown
            light
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
                  unavailableEmployees={[]}
                />
              )
            }
            {
              content === 'menu' && (
                <MenuContent
                  reccuring={activeGroupItem ? activeGroupItem.reccuring : reccuring}
                  photo={photo}
                  isCompleted={isCompleted}
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

