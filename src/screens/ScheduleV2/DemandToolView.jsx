import React, { useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Tooltip } from 'react-tooltip'

import styles from './DemandToolView.module.scss'

const ChevronIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={7}
      viewBox="0 0 13 7"
      fill="none"
      {...props}
    >
      <path
        stroke="#1685FC"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m1 6 5.5-5L12 6"
      />
    </svg>
  )
}

const ToolsIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={13}
      height={13}
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="#444"
        d="m10.3 8.2-.9.9.9.9-1.2 1.2 4.3 4.3c.6.6 1.5.6 2.1 0s.6-1.5 0-2.1l-5.2-5.2zm3.9 6.8c-.4 0-.8-.3-.8-.8 0-.4.3-.8.8-.8s.8.3.8.8-.3.8-.8.8zM3.6 8l.9-.6L6 5.7l.9.9.9-.9-.1-.1c.2-.5.3-1 .3-1.6 0-2.2-1.8-4-4-4-.6 0-1.1.1-1.6.3l2.9 2.9-2.1 2.1L.3 2.4C.1 2.9 0 3.4 0 4c0 2.1 1.6 3.7 3.6 4z"
      />
      <path
        fill="#444"
        d="m8 10.8.9-.8-.9-.9 5.7-5.7 1.2-.4L16 .8l-.7-.7-2.3 1-.5 1.2L6.9 8 6 7.1l-.8.9s.8.6-.1 1.5c-.5.5-1.3-.1-2.8 1.4L.2 13s-.6 1 .6 2.2 2.2.6 2.2.6l2.1-2.1c1.4-1.4.9-2.3 1.3-2.7.9-.9 1.6-.2 1.6-.2zm-3.1-.4.7.7-3.8 3.8-.7-.7z"
      />
    </svg>
  )
}

const DemandToolView = ({data, skills, jobTypes: jobTypesAll}) => {
  const { t } = useTranslation()
  const { jobTypes } = data

  const [expandedJobTypes, setExpandedJobTypes] = useState({})

  const jobTypesMap = jobTypesAll.reduce((acc, jobType) => {
    return {
      ...acc,
      [jobType.id]: jobType
    }
  }, {})

  const jobTypesEventsMap = data.shiftEvents.reduce((acc, event) => {
    const [postShiftIsLoadingSelector, jobTypeId] = event.resourceId.split('-')
    return {
      ...acc,
      [jobTypeId]: [...(acc[jobTypeId] || []), event]
    }
  }, {})

  return (
    <div className={styles.container}>
      {
        Object.entries(jobTypes).map(([jobTypeId, shifts]) => {
          const planningDemandShiftsCount = Object.keys(shifts).length
          const jobTypesEvents = jobTypesEventsMap[jobTypeId] || []
          const isExpanded = expandedJobTypes[jobTypeId] || false

          const mergedEvents = [...new Array(Math.max(planningDemandShiftsCount, jobTypesEvents.length))].map((_, i) => {
            return {
              event: jobTypesEvents[i] || null,
              demand: shifts[i] || null
            }
          })

          return (
            <div key={jobTypeId} className={styles.jobTypeSection}>
              <div className={styles.jobTypeHeader} onClick={() => setExpandedJobTypes(prev => ({...prev, [jobTypeId]: !prev[jobTypeId]}))}>
                <div>
                  { jobTypesMap[jobTypeId] ? jobTypesMap[jobTypeId].title : t('Unknown Job Type') }
                </div>
                <div className={styles.jobSectionButton}>
                  <div className={cn(styles.shiftCountContainer, {
                    [styles.filled]: planningDemandShiftsCount === jobTypesEvents.length,
                    [styles.extra]: jobTypesEvents.length > planningDemandShiftsCount,
                    [styles.warning]: planningDemandShiftsCount > jobTypesEvents.length,
                  })}>
                    { planningDemandShiftsCount }/{ jobTypesEvents.length }
                  </div>
                  <ChevronIcon className={cn(styles.jobHeaderIcon, {[styles.active]: isExpanded})} />
                </div>
              </div>
              {
                isExpanded && mergedEvents.map((item, i) => {
                  const { event, demand } = item
                  return (
                    <div key={i} className={styles.eventContainer}>
                      <div className={cn(styles.number, {[styles.extra]: event && !demand, [styles.warning]: !event})}>{i+1}</div>
                      <div className={styles.eventContent}>
                        <div className={styles.eventHeader}>
                          {
                            demand
                              ? <div style={{flex: 1}}>
                                  <div className={cn(styles.timeType, {[styles.warning]: !event})}>{ t('Demand') }</div>
                                  <div className={cn(styles.timeContainer, {[styles.warning]: !event})}>
                                    {`${demand.start} - ${demand.end}`}
                                  </div>
                                </div>
                              : null
                          }
                          <div style={{flex: 1}}>
                            <div className={cn(styles.timeType, {[styles.warning]: !event, [styles.extraText]: event && !demand})}>{ t('Planned') }</div>
                            {
                              event
                                ? <div className={cn(styles.timeContainer, {[styles.extraBorder]: event && !demand})}>
                                    { moment(event.start).format('HH:mm') } - { moment(event.end).format('HH:mm') }
                                  </div>
                                : <div className={styles.noMatch}>
                                    { t('No Match') }
                                  </div>
                            }
                          </div>
                          {
                            event && !demand
                              ? <div style={{flex: 1}}>
                                  <div className={styles.timeType} style={{opacity: 0}}>{ t('Demand') }</div>
                                  <div className={styles.extra}>
                                    { t('Extra') }
                                  </div>
                                </div>
                              : null
                          }
                          <div className={cn(styles.toolsIcon, {[styles.hidden]: !demand?.skills})} data-tooltip-id="skills" data-tooltip-html={`
                            <div style="font-family: 'Helvetica Neue Medium'; font-size: 12px">${t('Skills needed:')}</div>
                            <div style="font-family: 'Helvetica Neue'; font-size: 12px">${demand?.skills ? Object.values(demand.skills).map(s => s.name).join(', ') : null}</div>
                            `}>
                            <ToolsIcon />
                          </div>
                        </div>
                        {
                          event
                            ? <div className={styles.eventEmployee}>
                                <div className={styles.employeeImage}>
                                  <img src={event.new_employee ? event.new_employee.photo : event.old_employee?.photo} />
                                </div>
                                <div>
                                  <div className={styles.employeeName}>
                                    { event.new_employee ? event.new_employee.name : event.old_employee?.name }
                                  </div>
                                  <div className={styles.employeeSkill}>
                                    { event.new_employee && event.new_employee.skill ? event.new_employee.skill : event.old_employee?.skill || <>&nbsp;</> }
                                  </div>
                                </div>
                              </div>
                            : null
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
      <Tooltip
        id="skills" />
    </div>
  )
}

export default DemandToolView
