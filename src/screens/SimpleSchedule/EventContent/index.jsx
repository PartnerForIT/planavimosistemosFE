import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'react-tooltip';
import moment from 'moment';
import { useSelector } from 'react-redux';

import Dropdown from '../Dropdown';
import Content from '../Dropdown/Content';
import ChangeWorkingTime from './ChangeWorkingTime';
import AddWorkingTime from './AddWorkingTime';
import RefreshArrows from '../../../components/Icons/RefreshArrows';
import GroupIcon from '../../../components/Icons/group_icon.png';
import styles from './EventContent.module.scss';
//import PlaceholderAvatarIcon from "../../../components/Icons/PlaceholderAvatar";
import classNames from 'classnames';
//import { padStart } from '@fullcalendar/react';
import { AdditionalRatesDataSelector,
  currencySelector,
  scheduleSelector,
  settingCompanySelector, IntegrationsDataSelector } from '../../../store/settings/selectors';
import usePermissions from '../../../components/Core/usePermissions';
import Button from '../../../components/Core/Button/Button';

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
  group,
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
  addTimeline,
  isCompleted,
  copyTool,
  handleAddHistory,
  description,
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
  const schedule = useSelector(scheduleSelector);
  const permissions = usePermissions(permissionsConfig);
  const integrations = useSelector(IntegrationsDataSelector);
  const [openedGroup, setOpenedGroup] = useState(false);

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

  const openChangeWorkingTime = () => {
    //setContent('changeWorkingTime');
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
    console.log('delete');
  };
  const handleDuplicateWorkingTime = () => {
    console.log('duplicate');
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
console.log('group', group)
  const tooltipContent = () => {
    if (group) {
      return null
    }

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
        !group && reccuring && !photo &&
        <div className={styles.eventContent__reccuring}>
          <RefreshArrows />
        </div>
      }
      {
        group ? (
          <span className={styles.eventContent__group}
            onClick={() => setOpenedGroup(!openedGroup)}
            ref={buttonRef}
          >
            <div className={styles.eventContent__group_icon} >
              <img src={GroupIcon} alt={employeeName} />
            </div>
            <div className={styles.eventContent__group_title} >
              { group.length } { t('tasks') }
            </div>
          </span>
        ) : (
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
      { openedGroup && (
        <Content
          onClose={() => setOpenedGroup(false)}
          wrapperRef={dropdownRef}
          offset={buttonRef.current.getBoundingClientRect()}
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
                  {jobTypeName}
                </div>
              </div>
            </div>
            <div className={styles.eventContent__groupModal__count}>
              { group.length } { t('tasks') }
            </div>

            <div className={styles.eventContent__groupModal__list}>
              {
                group.map((item, index) => (
                  <div key={index} className={styles.eventContent__groupModal__item}>
                    <div className={styles.eventContent__groupModal__item__title}>
                      
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </Content>
      )}
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
        !copy_event && withMenu && !group ? (
          <Dropdown
            light
            cancel={content !== 'menu'}
            onCancel={handleCancel}
            ref={modalRef}
          >
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
              content === 'menu' && !group && (
                <div className={styles.eventContent__menu}>
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
                        {jobTypeName}
                      </div>
                    </div>
                  </div>
                  {
                    reccuring &&
                    <div className={styles.eventContent__userReccuring}>
                      <div className={styles.eventContent__userReccuring_head}>
                        <div className={styles.eventContent__userReccuring_icon}>
                          <RefreshArrows />
                        </div>
                        {t('Reccuring schedule')}
                        <Button inverseblack={false} size='little'>
                          { reccuring.type_id*1 === 0 && t('Daily') }
                          { reccuring.type_id*1 === 1 && t('Weekly') }
                          { reccuring.type_id*1 === 2 && t('Monthly') }
                        </Button>
                      </div>

                      <div className={styles.eventContent__userReccuring_body}>
                        { reccuring.type_id*1 === 0 && (
                          <div>
                            { reccuring?.reccuring_settings?.repeat_type*1 === 1 && (
                              <div className={styles.eventContent__userReccuring_body_section}>
                                { t('Repeat every day(s)') }
                                <div className={styles.eventContent__userReccuring_body_buttons}>
                                  {
                                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                      <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.day_of_week?.includes(index+1)} size='littler'>
                                        {t(day)}
                                      </Button>
                                    ))
                                  }
                                </div>
                              </div>
                              )
                            }
                              
                            { reccuring?.reccuring_settings?.repeat_type*1 === 2 &&
                              <div className={styles.eventContent__userReccuring_body_section}>
                                {t('Repeat every')} <b>{reccuring?.reccuring_settings?.repeat_every}</b> {t('day(s)')}
                              </div>
                            }
                          </div>
                          )
                        }

                        { reccuring.type_id*1 === 1 &&
                          <div>
                            <div className={styles.eventContent__userReccuring_body_section}>
                              {t('Repeat every')} <b>{reccuring?.reccuring_settings?.repeat_every}</b> {t('week(s)')}
                            </div>
                            <div className={styles.eventContent__userReccuring_body_section}>
                              {t('On the day of the week')}
                              <div className={styles.eventContent__userReccuring_body_buttons}>
                                {
                                  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                    <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.day_of_week?.includes(index+1)} size='littler'>
                                      {t(day)}
                                    </Button>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        }

                        { reccuring.type_id*1 === 2 &&
                          <div>
                            <div className={styles.eventContent__userReccuring_body_section}>
                              {t('Repeat every')}
                              <div className={styles.eventContent__userReccuring_body_buttons}>
                                {
                                  ['Jan', 'Feb', 'Mar', 'May', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((day, index) => (
                                    <Button key={index} inverseblack={!reccuring?.reccuring_settings?.repeat_every?.includes(index+1)} size='little'>
                                      {t(day)}
                                    </Button>
                                  ))
                                }
                              </div>
                            </div>

                            { reccuring.reccuring_settings.repeat_type*1 === 1 &&
                              <div className={styles.eventContent__userReccuring_body_section}>
                                {t('On the date')}
                                <div className={styles.eventContent__userReccuring_body_buttons}>
                                  {
                                    Array.from({length: 31}, (_, i) => i+1).map((day, index) => (
                                      <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.start?.includes(index+1)} size='littler'>
                                        {day}
                                      </Button>
                                    ))
                                  }
                                </div>
                              </div>  
                            }

                            { reccuring.reccuring_settings.repeat_type*1 === 2 &&
                              <>
                                <div className={styles.eventContent__userReccuring_body_section}>
                                  {t('On the week')}
                                  <div className={styles.eventContent__userReccuring_body_buttons}>
                                    {
                                      ['First', 'Second', 'Third', 'Fourth', 'Fifth'].map((day, index) => (
                                        <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.start?.includes(index+1)} size='littler'>
                                          {t(day)}
                                        </Button>
                                      ))
                                    }
                                  </div>
                                </div>
                                <div className={styles.eventContent__userReccuring_body_section}>
                                  {t('On the day of the week')}
                                  <div className={styles.eventContent__userReccuring_body_buttons}>
                                    {
                                      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                        <Button key={index+1} inverseblack={!reccuring?.reccuring_settings?.day_of_week?.includes(index+1)} size='littler'>
                                          {t(day)}
                                        </Button>
                                      ))
                                    }
                                  </div>
                                </div>
                              </>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  }
                  {
                    description && 
                    <div className={styles.eventContent__description}>
                      {description}
                    </div>
                  }
                  <div className={styles.eventContent__label}>
                    {t('Working Time')}
                  </div>
                  <div className={styles.eventContent__value}>
                    {`${moment(start).format('HH:mm')} – ${moment(end).format('HH:mm')}`}
                  </div>

                  <div className={styles.eventContent__label}>
                    {t('Place')}
                  </div>
                  <div className={styles.eventContent__value}>
                    { title.place ? title.place : '' }
                  </div>

                  <div className={styles.eventContent__label}>
                    {t('Job Type')}
                  </div>
                  <div className={styles.eventContent__value}>
                    { title.job_type ? title.job_type : '' }
                  </div>

                  <Dropdown.ItemMenu
                    title={t('Edit the entry')}
                    onClick={openChangeWorkingTime}
                  />

                  <Dropdown.ItemMenu
                    title={t('Duplicate to')}
                    onClick={handleDuplicateWorkingTime}
                  />

                  <Dropdown.ItemMenu
                    title={t('Delete')}
                    onClick={handleDeleteWorkingTime}
                    remove
                  />
                </div>
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

