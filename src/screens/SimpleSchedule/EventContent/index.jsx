import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-tooltip';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Dropdown from '../Dropdown';
import { TIMELINE } from '../../../const';
import ChangeWorkingTime from './ChangeWorkingTime';
import AddWorkingTime from './AddWorkingTime';
import ChangeEmployee from './ChangeEmployee';
import RefreshArrows from '../../../components/Icons/RefreshArrows';
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
  start,
  end,
  viewType,
  copy_event,
  editPermissions,
  addEmployee,
  addTimeline,
  //dayNumber,
  isCompleted,
  unavailableEmployees,
  markers,
  lineColor,
  handleCopyTool,
  copyTool,
  handleAddHistory
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

  useEffect(() => {
    Tooltip.rebuild();
  });

  const classes = classNames(
    styles.eventContent,
    {
      [styles.dayEnd]: isCompleted,
      [styles.eventContent__time]: content === 'addWorkingTime',
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
    onDeleteTimeline({ id });
  };
  const handleEmptyTimeline = () => {
    onEmptyTimeline({ id });
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

    onChangeWorkingTime({ id, time });
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

    addTimeline({ id, time });
  };
  const handleChangeEmployee = (nextEmployeeId) => {
    onChangeEmployee({
      employeeId: nextEmployeeId,
      id,
    });
  };
  const tooltipType = () => {
    let type = 'time';

    if (start && end && moment().isBetween(start, end)) {
      type += '_active';
    } else if (isCompleted) {
      type += '_past';
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
    return (
      `<div class="timeline-tooltip">${t('From')} <b>${moment(start).format('HH:mm')}</b> ${t('to')} <b>${moment(end).format('HH:mm')}</b><br/>
      ${t('Total Hours')} <b>${convertMinutesToHoursAndMinutes(minutes)}</b>`
      + (nightPermission ? `<br />${t('Work hours')} <b>${convertMinutesToHoursAndMinutes(work_minutes)}</b>` : ``)
      + (schedule.deduct_break || integrations?.iiko ? `<br />${t('Break hours')} <b>${convertMinutesToHoursAndMinutes(break_minutes)}</b>` : ``)
      + (nightPermission ? `<br />${t('Night hours')} <strong>${convertMinutesToHoursAndMinutes(night_minutes)}</strong>` : ``)
      + (costPermission ? `<br />${t('Cost')} <b>${cost}${currency}</b>` : ``)
      + `</div>`
    )
  }
  
  return (
    <div
      className={classes}
      data-for={tooltipType()}
      data-html={true}
      data-tip={copy_event || copyTool || tooltipContent()}
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
      {
        photo && 
        <div className={styles.eventContent__photo}>
          <img src={photo} alt={employeeName}
            className={styles.eventContent__photo__img}
          />
          { reccuring &&
            <div className={styles.eventContent__reccuring}>
              <RefreshArrows />
            </div>
          }
        </div>
      }
      {
        reccuring && !photo &&
        <div className={styles.eventContent__reccuring}>
          <RefreshArrows />
        </div>
      }
      {
          (viewType === TIMELINE.DAY || viewType === TIMELINE.WEEK) && (

          <span className={styles.eventContent__title} >
            {
              copyTool && <span onClick={copyEvent} className={'copy-add event'}>{t('Paste the Time')}</span>
            }

            { title.place && <span className={styles.eventContent__place}>{title.place}</span> }
            { title.job_type && <span className={styles.eventContent__job_type}>{title.job_type}</span> }
          </span>

        )
      }

      <div className={styles.eventContent__leftSpace} />
      {
        content === 'addWorkingTime' && (
          <Dropdown
            cancel={content !== 'menu'}
            onCancel={() => setContent('menu')}
            ref={modalAddRef}
            buttonClass={styles.eventContent__invisible}
          >
            <AddWorkingTime
              onClose={() => setContent('menu')}
              photo={photo}
              jobTypeName={jobTypeName}
              employeeName={employeeName}
              start={start}
              end={end}
              onChangeTime={handleAddWorkingTime}
            />
          </Dropdown>
        )
      }
      {
        !copy_event && withMenu ? (
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
                  employeeName={employeeName}
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
                  employeeName={employeeName}
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
                    <div className={styles.eventContent__userInfo__right}>
                      <div className={styles.eventContent__userInfo__right__fullName}>
                        {employeeName}
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
                  {/* Edgaras suggestion 2022-05-25 */}
                  { !modules.manual_mode && (
                      <Dropdown.ItemMenu
                        title={t('Change Employee')}
                        onClick={openChangeEmployee}
                      />
                    )
                  } 
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
  );

};

