import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import cn from 'classnames'

import './styles.scss'
import styles from './styles.module.scss'

import { getCompanyEmployeesAll, getCompanyTimeOffRequests, getCompanyTimeOffPolicies, getPlaces, getCompanyHolidays } from '../../../api'
import { TIMELINE } from '../../../const'
import {
  getCheckedEmployees,
  getCheckedElements,
  getEmployeesWithEvents,
  getEmployeesWithPlaces,
  getEventsForDay,
  rangesOverlap,
  getCheckedEmployeeIds,
  generateResourcesFromEmployees,
  generateTimeOffEvents,
  generateAvailabilityEvents,
  getEmployeesFromResources,
 } from './utils'

import ResourceAreaHeader from '../../../screens/Schedule/ResourceAreaHeader'
import AvailabilityCard from '../AvailabilityCard'
import Tabs from '../Tabs'
import PolicySideBar from '../PolicySideBar'
import CustomSelect from '../../Core/CustomSelect'
import Progress from '../../Core/Progress'
import HolidayIcon from '../../Core/HolidayIcon/HolidayIcon'
import Event from '../Event'

const AVAILABILITY_RESOURCE = { id: 'availability', title: 'Availability', isGroup: false, isSubGroup: false, isEmployee: false, order: 0, level: 0 }
const CALENDAR_VIEWS_CONFIG = {
  day: {
    type: 'resourceTimelineDay',
    title: 'ddd MMM, DD, YYYY',
    slotLabelFormat: 'HH:mm',
    slotDuration: '1:00',
    // snapDuration: '00:15',
  },
  week: {
    type: 'resourceTimelineWeek',
    slotDuration: '24:00',
    // snapDuration: '6:00',
  },
  month: {
    type: 'resourceTimeline',
    // slotDuration: '24:00',
    // slotDuration: '12:00',
  }
}

const filterResources = (items, policies, places, events, currentMonth, activeAvailability) => {
  let checkedEmployees = getCheckedEmployees(items)
  const checkedPolices = getCheckedElements(policies)
  const checkedPlaces = getCheckedElements(places)
  if (checkedPolices.length) {
    const policiesMap = checkedPolices.reduce((acc, policy) => ({...acc, [policy.id]: true }), {})
    const eventsMap = events.filter(e => e.resourceId !== 'availability' && policiesMap[e.policy_id]).reduce((acc, event) => ({
      ...acc,
      [event.employee_id]: true,
    }), {})
    checkedEmployees = getEmployeesWithEvents(checkedEmployees, eventsMap)
  }
  if (checkedPlaces.length) {
    checkedEmployees = getEmployeesWithPlaces(checkedEmployees, checkedPlaces)
  }
  if (activeAvailability) {
    const day = Number(activeAvailability.split('-')[1])+1
    const temp = getEventsForDay(events.filter(e => e.resourceId !== 'availability'), `${currentMonth}-${day}`)
    checkedEmployees = getEmployeesWithEvents(checkedEmployees, temp)
  }
  return checkedEmployees
}

const filterEvents = (events, currentMonth, activeAvailability) => {
  if (!activeAvailability) {
    return events
  }
  const day = Number(activeAvailability.split('-')[1])+1
  const start = moment(`${currentMonth}-${day}`).startOf('day')
  const end = moment(`${currentMonth}-${day}`).endOf('day')
  return events.filter(event => {
    if (event.resourceId === 'availability') {
      return true
    }
    const eventStart = moment(event.start)
    const eventEnd = moment(event.end)
    return rangesOverlap(start, end, eventStart, eventEnd)
  })
}

const resourceLabelClassNames = ({ resource }) => {
  const { extendedProps: props } = resource;
  const classes = []
  if (props.isEmployee) {
    classes.push('fc-datagrid-cell-employee');
  }
  if (props.isInLastSubgroupOfGroup) {
    classes.push('fc-datagrid-cell-last');
  }
  if (props.level === 2) {
    classes.push('fc-datagrid-cell-level-2');
  }
  if (resource.id === 'availability') {
    classes.push('sticky-resource');
  }
  return classes
}

const resourceLaneClassNames = ({ resource }) => {
  if (resource.id === 'availability') {
    return ['sticky-resource']
  }
  return []
}

const TimeOffCalendar = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const [{resources, policies, places}, setData] = useState({
    places: [],
    policies: [],
    resources: [],
  })
  const [loading, setLoading] = useState(false)
  const [timeline, setTimeline] = useState(TIMELINE.MONTH)
  const [currentStartDate, setCurrentStartDate] = useState(moment().startOf(timeline).format('YYYY-MM-DD'))
  const [holidays, setHolidays] = useState({})
  const [events, setEvents] = useState([])
  const [activeAvailability, setActiveAvailability] = useState(null)

  const calendarRef = useRef(null)
  const sideBarRef = useRef(null)

  const currentMonth = moment(currentStartDate).startOf('month').format('YYYY-MM')
  
  useEffect(() => {
    init()
  }, [companyId])

  useEffect(() => {
    getHolidays()
  }, [companyId, currentMonth])

  useEffect(() => {
    if (resources.length && policies.length) {
      const viewMap = {
        [TIMELINE.DAY]: 'daily',
        [TIMELINE.WEEK]: 'weekly',
        [TIMELINE.MONTH]: 'monthly',
      }
      
      const params = {
        view: viewMap[timeline],
        start_date: currentStartDate,
        employees: getCheckedEmployeeIds(resources),
        policies: policies.filter(p => p.checked).map(p => p.id),
        places: places.filter(p => p.checked).map(p => p.id),
      }
      getEvents(params)
    }
  }, [currentStartDate, policies, places, resources, timeline])

  const init = async () => {
    const [employeesRes, policiesRes, placesRes] = await Promise.all([
      getCompanyEmployeesAll(companyId),
      getCompanyTimeOffPolicies(companyId),
      getPlaces(companyId),
    ])
    
    const data = {resources: [], policies: [], places: []}
    if (Array.isArray(employeesRes?.users)) {
      const grouped = generateResourcesFromEmployees(employeesRes?.users)
      data.resources = grouped
    }
    if (Array.isArray(policiesRes?.policies)) {
      data.policies = policiesRes.policies.map(p => ({...p, checked: false, title: p.name, isEmployee: true}))
    }
    if (Array.isArray(placesRes)) {
      data.places = placesRes.map(p => ({...p, checked: false, title: p.name, isEmployee: true}))
    }
    setData(data)
  }

  const getEvents = async (params) => {
    if (sideBarRef.current) {
      sideBarRef.current.close()
    }
    setLoading(true)
    const res = await getCompanyTimeOffRequests(companyId, params)
    if (Array.isArray(res?.request_behalf)) {
      const events = generateTimeOffEvents(res.request_behalf, policies, [styles.event])
      setEvents([...events, ...generateAvailabilityEvents(currentStartDate, getEmployeesFromResources(resources), events, [styles.availabilityEvent])])
    }
    setLoading(false)
  }

  const getHolidays = async () => {
    setHolidays({})
    const res = await getCompanyHolidays(companyId, {
      startDate: moment(currentStartDate).startOf('month').format('YYYY-MM-DD'),
      endDate: moment(currentStartDate).endOf('month').format('YYYY-MM-DD'),
    })
    if (res) {
      setHolidays(!Array.isArray(res) ? res : {})
    }
  }

  const getResourceTitle = useCallback((viewType, date) => {
    switch (viewType) {
      case 'day':
        return `${t(date.format('dddd'))}, ${t(date.format('MMMM'))}${date.format(' D, YYYY')}`
      case 'week':
        const startOfWeek = date.clone().startOf('isoWeek')
        const endOfWeek = date.clone().endOf('isoWeek')
        return `${t(startOfWeek.format('MMM'))} ${startOfWeek.format('D')} – ${endOfWeek.format('D, YYYY')}`
      case 'month':
        return `${t(date.format('MMMM'))} ${date.format('YYYY')}`
      default: {
        return ''
      }
    }
  }, [t])

  const changeView = (viewtype, date) => {
    calendarRef.current.getApi().changeView(viewtype, date)
    setTimeline(viewtype)
  }

  const slotLabelClassNames = useCallback(({ date: monthDate }) => {
    const date = moment(monthDate)
    const holiday = holidays[date.format('YYYY-MM-DD')]
    return holiday ? 'holiday-slot-weekend-header' : ''
  }, [holidays])

  const slotLaneClassNames = useCallback(({ date: monthDate }) => {
    const date = moment(monthDate)
    const holiday = holidays[date.format('YYYY-MM-DD')]
    return holiday ? 'holiday-slot-weekend' : ''
  }, [holidays])

  const handleChangeTimeline = (view) => {
    const startDate = view === TIMELINE.MONTH ? moment().startOf('month') : view === TIMELINE.WEEK ? moment().startOf('isoWeek') : moment()
    changeView(view, startDate.toDate())
    setCurrentStartDate(startDate.format('YYYY-MM-DD'))
  }

  const handleClickDay = useCallback((date) => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView(TIMELINE.DAY, date.format('YYYY-MM-DD'))
      setCurrentStartDate(date.format('YYYY-MM-DD'))
      setTimeline(TIMELINE.DAY)
    }
  }, [])

  const handleChangeAvailability = useCallback((id, event) => {
    setActiveAvailability(id)
    if (id) {
      sideBarRef.current.open(event.extendedProps.metadata.chartData)
      return
    }
    sideBarRef.current.close()
  }, [])

  const handleChangeFilter = useCallback((key, data) => {
    setData(prev => ({...prev, [key]: data}))
  }, [])

  const renderResourceAreaHeaderContent = useCallback(({view}) => {
    const handleClickPrev = () => {
      view.calendar.prev()
      const targetDate = view.getCurrentData().currentDate
      if (timeline === TIMELINE.MONTH) {
        
        const date = moment(currentStartDate).startOf('month').subtract(1, 'days').startOf('month')
        setCurrentStartDate(date.format('YYYY-MM-DD'))
      } else {
        setCurrentStartDate(moment(targetDate).format('YYYY-MM-DD'))
      }
    }

    const handleClickNext = () => {
      view.calendar.next()
      const targetDate = view.getCurrentData().currentDate
      if (timeline === TIMELINE.MONTH) {
        const date = moment(currentStartDate).endOf('month').add(1, 'days')
        setCurrentStartDate(date.format('YYYY-MM-DD'))
      } else {
        setCurrentStartDate(moment(targetDate).format('YYYY-MM-DD'))
      }
    }

    const inputDate = moment(currentStartDate)

    const title = getResourceTitle(view.type, inputDate)
    return (
      <ResourceAreaHeader
        title={title}
        holiday={false}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext} />
    )
  }, [timeline, currentStartDate])

  const renderResourceLabelContent = useCallback(({ resource }) => {
    const { photo } = resource.extendedProps
    return (
      <div className={styles.resourceLabelContent}>
        { resource.title }
        {
          photo
            ? <div
                data-tooltip-id='user_avatar'
                data-tooltip-html={`<div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden;"><img alt="" style="width: 100%; height: 100%; object-fit: cover;" src="${photo}" /></div>`}
                style={{width: 20, height: 20, position: 'absolute', zIndex: 10, right: 15}}
                className={styles.avatarTrigger}
                >
                <img alt='' src={photo} className={styles.resourcePhoto} />
              </div>
            : null
        }
      </div>
    )
  }, [])

  const renderEventContent = useCallback(({event, view}) => {
    if (event.getResources()[0].id === 'availability') {
       return (
        <AvailabilityCard
          event={event}
          isActive={activeAvailability === event.id}
          onPress={(id) => handleChangeAvailability(id, event)} />
      )
    }
    return <Event event={event} view={view} /> 
  }, [activeAvailability, loading])

  const renderHeaderCell = useCallback(({date: monthDate}) => {
    const date = moment(monthDate)
    const holiday = holidays[date.format('YYYY-MM-DD')]
    return (
      <div className="header-cell" onClick={() => handleClickDay(date)}>
        <span className="schedule-enter-day">{ t('Go') }</span>
        { `${date.format('D')}` }
        <HolidayIcon holidays={holiday} month={true} />
      </div>
    )
  }, [holidays])

  return (
    <div className={styles.screen}>
      <div className={styles.toolsContainer}>
        <CustomSelect
          placeholder={t('All places')}
          items={places}
          onChange={data => handleChangeFilter('places', data)}
          width='auto' />
        <CustomSelect
          placeholder={t('All Policies')}
          items={policies}
          onChange={data => handleChangeFilter('policies', data)}
          width='auto' />
        <CustomSelect
          placeholder={t('All employees')}
          buttonLabel={t('Filter')}
          items={resources}
          onChange={data => handleChangeFilter('resources', data)}
          width='auto' />
        <Tabs 
          selected={timeline}
          onChange={handleChangeTimeline}
          options={[{
            title: t('Day'),
            key: TIMELINE.DAY,
          }, {
            title: t('Week'),
            key: TIMELINE.WEEK,
          }, {
            title: t('Month'),
            key: TIMELINE.MONTH,
          }]} />
      </div>
      <div className={cn('calendar-wrapper', timeline)}>
        <FullCalendar
          ref={calendarRef}
          resourceOrder="order"
          initialView={'month'}
          firstDay={1}
          schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
          plugins={[resourceTimelinePlugin, resourceDayGridPlugin, interactionPlugin, momentPlugin]}
          headerToolbar={false}
          aspectRatio={1}
          height="100%"
          resourceAreaWidth="20%"
          eventStartEditable={false}
          eventMinWidth={10}
          dayMinWidth={10}
          slotMinWidth={10}
          views={{
            ...CALENDAR_VIEWS_CONFIG,
            day: {
              ...CALENDAR_VIEWS_CONFIG.day,
            },
            week: {
              ...CALENDAR_VIEWS_CONFIG.week,
              slotLabelFormat: renderHeaderCell,
              slotLabelClassNames: slotLabelClassNames,
              slotLaneClassNames: slotLaneClassNames,
            },
            month: {
              ...CALENDAR_VIEWS_CONFIG.month,
              slotLabelContent: renderHeaderCell,
              slotLabelClassNames: slotLabelClassNames,
              slotLaneClassNames: slotLaneClassNames,
              visibleRange: () => {
                const visibleRange = {
                  start: moment(currentStartDate).clone().startOf('month').toDate(),
                  end: moment(currentStartDate).clone().endOf('month').toDate(),
                }
                return visibleRange
              },
            },
          }}
          resources={[AVAILABILITY_RESOURCE, ...filterResources(resources, policies, places, events, currentMonth, activeAvailability, loading)]}
          events={filterEvents(events, currentMonth, activeAvailability)}
          eventContent={renderEventContent}
          resourceAreaHeaderContent={renderResourceAreaHeaderContent}
          resourceLabelClassNames={resourceLabelClassNames}
          resourceLaneClassNames={resourceLaneClassNames}
          resourceLabelContent={renderResourceLabelContent}
        />
      </div>
      <PolicySideBar ref={sideBarRef} />
      <Tooltip
        id='time_off'
        className={styles.timeOffTooltip}
        effect='solid' />
      <Tooltip
        id='availability_description'
        className={styles.timeOffTooltip}
        style={{backgroundColor: '#000', color: '#fff'}}
        effect='solid' />
      <Tooltip
        id='user_avatar'
        arrowColor='transparent'
        style={{backgroundColor: 'transparent', zIndex: 1000}}
        place="right"
        effect='solid' />
      <Tooltip
        id='holiday'
        className={styles.timeOffTooltip}
        effect='solid' />
      {
        loading
          ? <div className={styles.overlayProgress}>
              <Progress />
            </div>
          : null
      }
    </div>
  )
}

export default TimeOffCalendar
