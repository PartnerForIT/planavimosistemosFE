import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import styles from '../Schedule/EventContent/EventContent.module.scss'
import css from './MonthCell.module.scss'

import Dropdown from '../Schedule/Dropdown'
import ChangeEmployee from '../Schedule/EventContent/ChangeEmployee'
import ReplacedEmployee from '../Schedule/EventContent/ReplacedEmployee'
import ChangeWorkingTime from '../Schedule/EventContent/ChangeWorkingTime'
import AddWorkingTime from '../Schedule/EventContent/AddWorkingTime'
import TimeOffSymbol1 from '../../components/Icons/TimeOffSymbol1'
import TimeOffSymbol2 from '../../components/Icons/TimeOffSymbol2'
import TimeOffSymbol3 from '../../components/Icons/TimeOffSymbol3'
import TimeOffSymbol4 from '../../components/Icons/TimeOffSymbol4'
import TimeOffSymbol5 from '../../components/Icons/TimeOffSymbol5'
import TimeOffSymbol6 from '../../components/Icons/TimeOffSymbol6'
import TimeOffSymbol7 from '../../components/Icons/TimeOffSymbol7'
import TimeOffSymbol8 from '../../components/Icons/TimeOffSymbol8'
import TimeOffSymbol9 from '../../components/Icons/TimeOffSymbol9'

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

const convertMinutesToHoursAndMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const formattedHours = hours < 10 ? `0${hours}` : hours
  const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes
  return `${formattedHours}:${formattedMinutes}`
}

const MonthCell = ({
  selectedEvent,
  resourceId,
  start,
  end,
  isCompleted,
  newEmployee,
  oldEmployee,
  employeeName,
  empty,
  activeDrag,
  copy_event,
  copyTool,
  empty_manual,
  schedule,
  integrations,
  nightPermission,
  costPermission,
  minutes,
  work_minutes,
  break_minutes,
  night_minutes,
  cost,
  shiftId,
  id,
  photo,
  jobTypeName,
  handleCopyTool,
  onEmptyTimeline,
  onDeleteTimeline,
  withMenu,
  showHoursCount,
  nightDuration,
  title,
  lineColor,
  onChangeEmployee,
  onChangeWorkingTime,
  unavailableEmployees,
  editPermissions,
  addTimeline,
  addEmployee,
  employeeId,
  markers,
  isMarkerMode,
  handleMarker,
  handleAddHistory,
  policies,
}) => {
  const { t } = useTranslation()

  const currency = useSelector(({settings}) => {
    return settings.currency.find((curr) => curr.code === settings.company?.currency || curr.name === settings.company?.currency)?.symbol ?? ''
  })
  const modules = useSelector(state => state.company.modules)

  const modalRef = useRef(null)
  const modalAddRef = useRef(null)

  const [content, setContent] = useState('menu')
  // const [isShown, setIsShown] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (modalAddRef.current) {
      if (content === 'addWorkingTime') {
        modalAddRef.current.open()
        return
      }
       modalAddRef.current.close()
    }
  }, [content])

  const tooltipType = () => {
    let type = 'time'
    if (start && end && moment().isBetween(start, end)) {
      type += '_active';
    } else if (isCompleted) {
      type += '_past';
    } else if (!newEmployee?.name && (employeeName === 'Empty' || empty)) {
      type += '_empty';
    }
    return type
  }

  const tooltipContent = () => {
    return (
      `<div class="timeline-tooltip">${t('From')} <b>${moment(start).format('HH:mm')}</b> ${t('to')} <b>${moment(end).format('HH:mm')}</b><br/>
      ${t('Total Hours')} <b>${convertMinutesToHoursAndMinutes(minutes)}</b>`
      + (nightPermission ? `<br />${t('Work hours')} <b>${convertMinutesToHoursAndMinutes(work_minutes)}</b>` : ``)
      + (schedule.deduct_break || integrations?.iiko ? `<br />${t('Break hours')} <b>${convertMinutesToHoursAndMinutes(break_minutes)}</b>` : ``)
      + (nightPermission ? `<br />${t('Night hours')} <strong>${convertMinutesToHoursAndMinutes(night_minutes)}</strong>` : ``)
      + (costPermission ? `<br />${t('Cost')} <b>${cost}${currency}</b>` : ``)
      + (selectedEvent.withConflicts?.comment  ? `<br /><span style="display: inline-block; color: #d9dfe3; text-decoration: underline; transform: translateY(-5px);">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><br /><span>${selectedEvent.withConflicts.comment}</span>` : ``)
      + `</div>`
    )
  }

  const markerComment = () => {
    const current = markers.find(e => moment(e.date).isSame(moment(start), 'day') && e.employee_id === employeeId)
    return current ? current.comment : null
  }

  const handleCancel = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close()
    }
    setContent('menu')
  }

  const openAddWorkingTime = () => {
    setContent('addWorkingTime')
  }

  const openChangeEmployee = () => {
    modalRef.current.open()
    setContent('changeEmployee')
  }

  const openChangeWorkingTime = () => {
    setContent('changeWorkingTime')
  }

  const openCopyMode = () => {
    if (modalAddRef.current) {
      modalAddRef.current.close()
    }
    setContent('menu')
    handleCopyTool({start, end})
    modalRef.current.close()
  }

  const handleEmptyTimeline = () => {
    onEmptyTimeline({ id, shiftId })
  }

  const handleDeleteTimeline = () => {
    onDeleteTimeline({ id, shiftId })
    modalRef.current.close()
  }

  const handleChangeEmployee = (nextEmployeeId) => {
    onChangeEmployee({ shiftId, employeeId: nextEmployeeId, id})
    modalRef.current.close()
  }

  const handleAddWorkingTime = (value) => {
    const timeStart = value.start.split(':');
    const timeEnd = value.end.split(':');
    let time;
    if ((timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1])) {
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
  }

  const handleChangeWorkingTime = (value) => {
    const timeStart = value.start.split(':')
    const timeEnd = value.end.split(':')
    let time;
    if ((timeStart[0] * 60 + +timeStart[1]) > (timeEnd[0] * 60 + +timeEnd[1])) {
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(end).set({ h: timeEnd[0], m: timeEnd[1] }),
      }
    } else {
      time = {
        start: moment(start).set({ h: timeStart[0], m: timeStart[1] }),
        end: moment(start).set({ h: timeEnd[0], m: timeEnd[1] }),
      }
    }

    onChangeWorkingTime({ id, shiftId, time })
    modalRef.current.close()
  }

  const handleCopyEvent = () => {
    handleAddHistory({resourceId: resourceId, start: moment(start).format('YYYY-MM-DD'), end: moment(start).format('YYYY-MM-DD'), copy_event: true})
  }

  const marker = markerComment()
  const isMarkerExist = marker !== null

  if (selectedEvent.timeOffRequest && (selectedEvent.timeOffRequest.status === 'approved' || (selectedEvent.timeOffRequest.status === 'pending' && empty_manual))) {
    const policy = policies[selectedEvent.timeOffRequest.policy_id] || {color: DEFAULT_COLOR}
    return (
      <div className={css.timrOffRequest} style={{backgroundColor: policy.color || DEFAULT_COLOR}}>
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
            ? <div className={css.pendingDot} />
            : null
        }
      </div>
    )
  }

  return (
    <div
      className={css.container}
      style={{opacity: isCompleted ? 0.5 : 1}}
      data-tooltip-id={marker ? 'user_marker' : tooltipType()}
      data-tooltip-html={activeDrag || copy_event || copyTool || empty_manual || empty || (employeeName === 'Empty' && !selectedEvent.new_employee?.id) ? marker : tooltipContent()}
      >
      {
        selectedEvent.timeOffRequest && !empty_manual
          ? <AttentionIcon
              style={{position: 'absolute', top: 1, right: 0, zIndex: 2}}
              width={12}
              height={12}
              color={'#FD4646'} />
          : null
      }
      <div className={css.content} style={{justifyContent: (showHoursCount || selectedEvent.rId) ? 'center' : 'flex-start'}}>
        {
          (!empty_manual && newEmployee?.name) || selectedEvent.rId || copy_event
            ? showHoursCount || selectedEvent.rId
              ? <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}}>
                  <div style={{color: '#333945', fontSize: 11, fontWeight: 'bold'}}>{minutes / 60}</div>
                  <div style={{color: '#db894f', fontSize: 11, fontWeight: 'bold', borderTop: '1px solid #db894f'}}>{nightDuration}h</div>
                </div>
              : <div className={css.eventTime} style={{borderColor: selectedEvent.withConflicts ? '#E80000' : lineColor}}>
                  { moment(start).format('HH:mm')}<br />{moment(end).format('HH:mm') }
                </div>
            : editPermissions && !isCompleted && (empty_manual || employeeName === 'Empty')
              ? isMarkerMode // && employeeName !== 'Empty'
                ? isMarkerExist
                  ? <div className={css.removeMarker} onClick={() => handleMarker(employeeId, moment(start))}></div>
                  : <div className={css.addMarker} onClick={() => handleMarker(employeeId, moment(start))}></div>
                : copyTool
                  ? null
                  : <div className={css.addButton} onClick={(employeeName === 'Empty' || empty) ? addEmployee : openAddWorkingTime}>
                    </div>
              : null
        }
        {
          (copyTool && !selectedEvent.rId) ? <span onClick={handleCopyEvent} style={{textAlign: 'center', fontSize: 11}} className={'copy-add event'}>{t('Paste the Time')}</span> : null
        }
      </div>
      {
        nightDuration && !empty_manual && title && employeeName !== 'Empty' && !(showHoursCount || selectedEvent.rId)
          ? <div className={css.nightHours}>
              { nightDuration }h
            </div>
          : null
      }
      {
        !copy_event && newEmployee?.name !== oldEmployee?.name && !empty_manual
          ? <div className={css.changeEmployeeContainer}>
              <ReplacedEmployee
                newEmployee={newEmployee}
                oldEmployee={oldEmployee}
                onDelete={handleDeleteTimeline}
                onChangeEmployee={openChangeEmployee}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isShown={isCompleted ? false : isOpen}
                isToday={isCompleted}
              />
            </div>
          : null
      }
      {
        content === 'addWorkingTime'
          ? <Dropdown
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
          : null
      }
      {
        !copy_event && withMenu && !empty && !empty_manual && !isCompleted && (employeeName !== 'Empty' || newEmployee?.name)
          ? <div className={css.dropdownContainer}>
              <Dropdown ref={modalRef} light cancel={content !== 'menu'} onCancel={handleCancel}>
                {
                  ((c) => {
                    switch (c) {
                      case 'menu':
                        return (
                          <>
                            <div className={styles.eventContent__userInfo}>
                              {
                                (Boolean(newEmployee?.name) || empty)
                                  ? (newEmployee?.photo === null || empty)
                                    ? ''
                                    : <img
                                        alt='avatar'
                                        src={newEmployee?.photo}
                                        className={styles.eventContent__userInfo__avatar}
                                        />
                                  : photo
                                    ? <img
                                        alt='avatar'
                                        src={photo}
                                        className={styles.eventContent__userInfo__avatar}
                                      />
                                    : null
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
                            {
                              selectedEvent.withConflicts
                                ? <Dropdown.ItemMenu
                                    title={t('Remove comment')}
                                    onClick={() => handleMarker(employeeId, moment(start))}
                                    remove
                                  />
                                : null
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
                      case 'changeEmployee':
                        return (
                          <ChangeEmployee
                            photo={photo}
                            jobTypeName={jobTypeName}
                            employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
                            onChangeEmployee={handleChangeEmployee}
                            unavailableEmployees={unavailableEmployees}
                          />
                        )
                      case 'changeWorkingTime':
                        return (
                          <ChangeWorkingTime
                            photo={photo}
                            jobTypeName={jobTypeName}
                            employeeName={newEmployee?.name ? newEmployee?.name : employeeName}
                            start={start}
                            end={end}
                            onChangeTime={handleChangeWorkingTime}
                          />
                        )
                      default:
                        return null
                    }
                  })(content)
                }
              </Dropdown>
            </div>
          : null
      }
      
    </div>
  )
}

export default MonthCell