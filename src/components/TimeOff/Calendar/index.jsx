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
import { fade } from '@material-ui/core/styles/colorManipulator'

import './styles.scss'
import styles from './styles.module.scss'

import { getCompanyEmployeesAll, getCompanyTimeOffRequests, getCompanyTimeOffPolicies, getPlaces } from '../../../api'
import { TIMELINE, COLORS_JOB_TYPE } from '../../../const'

import ResourceAreaHeader from '../../../screens/Schedule/ResourceAreaHeader'
import AvailabilityCard from '../AvailabilityCard'
import Tabs from '../Tabs'
import PolicySideBar from '../PolicySideBar'
import CustomSelect from '../../Core/CustomSelect'

const AVAILABILITY_RESOURCE = { id: 'availability', title: 'Availability', isGroup: false, isSubGroup: false, isEmployee: false, order: 0, level: 0, className: 'sticky-resource' }
const CALENDAR_VIEWS_CONFIG = {
  day: {
    type: 'resourceTimelineDay',
    title: 'ddd MMM, DD, YYYY',
    slotLabelFormat: 'HH:mm',
    slotDuration: '1:00',
    snapDuration: '00:15',
  },
  week: {
    type: 'resourceTimelineWeek',
    slotDuration: '24:00',
    snapDuration: '6:00',
  },
  month: {
    type: 'resourceTimeline',
    // slotDuration: '12:00',
  }
}

function groupEmployees(employees) {
  const topLevel = [];
  const groups = new Map();

  // Build group/subgroup/employee tree
  for (const emp of employees) {
    const { group_id, subgroup_id } = emp;
    if (!group_id) {
      topLevel.push({
        // ...emp,
        id: emp.id,
        group_id: emp.group_id,
        subgroup_id: emp.subgroup_id,
        photo: emp.photo,
        isGroup: false,
        isSubGroup: false,
        isEmployee: true,
        checked: false,
        title: `${emp.name} ${emp.surname}`,
      })
      continue;
    }
    if (!groups.has(group_id)) {
      groups.set(group_id, { id: group_id, isGroup: true, isSubGroup: false, isEmployee: false, title: emp.groups, children: [] });
    }
    const group = groups.get(group_id);
    if (!subgroup_id) {
      group.children.push({
        // ...emp,
        id: emp.id,
        group_id: emp.group_id,
        subgroup_id: emp.subgroup_id,
        photo: emp.photo,
        isGroup: false,
        isSubGroup: false,
        isEmployee: true,
        checked: false,
        title: `${emp.name} ${emp.surname}`,
      })
    } else {
      let subgroup = group.children.find(c => c.id === subgroup_id && c.isSubGroup);
      if (!subgroup) {
        subgroup = { id: subgroup_id, isGroup: false, isSubGroup: true, isEmployee: false, title: emp.subgroups, children: [] };
        group.children.push(subgroup);
      }
      subgroup.children.push({
        // ...emp,
        id: emp.id,
        group_id: emp.group_id,
        subgroup_id: emp.subgroup_id,
        photo: emp.photo,
        isGroup: false,
        isSubGroup: false,
        isEmployee: true,
        checked: false,
        title: `${emp.name} ${emp.surname}`,
      })
    }
  }

  // Sort children: employees first, then subgroups
  function sortChildren(children) {
    for (const child of children) {
      if (child.children) sortChildren(child.children);
    }
    children.sort((a, b) => {
      if (a.isEmployee && !b.isEmployee) return -1;
      if (!a.isEmployee && b.isEmployee) return 1;
      return 0;
    });
  }

  // Attach parent references for meta assignment
  function attachParents(items, parent = null) {
    for (const item of items) {
      item.__parent = parent;
      if (item.children) attachParents(item.children, item);
    }
  }

  // Assign meta fields recursively
  let currentOrder = 1;
  function assignMeta(items, level = 0) {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      item.order = currentOrder++;
      item.level = level;
      item.isLast = i === items.length - 1;

      if (item.isEmployee) {
        // isLastSubgroup: last employee among siblings
        const employeeSiblings = items.filter(c => c.isEmployee);
        item.isLastSubgroup = employeeSiblings.length > 0 && employeeSiblings[employeeSiblings.length - 1].id === item.id;

        // isInLastSubgroupOfGroup: employee belongs to last subgroup in its group
        if (item.__parent && item.__parent.isSubGroup && item.__parent.__parent && item.__parent.__parent.isGroup) {
          const group = item.__parent.__parent;
          const subgroups = group.children.filter(c => c.isSubGroup);
          const lastSubgroup = subgroups.length > 0 ? subgroups[subgroups.length - 1] : null;
          item.isInLastSubgroupOfGroup = lastSubgroup && lastSubgroup.id === item.__parent.id;
        } else {
          item.isInLastSubgroupOfGroup = false;
        }
      } else {
        item.isLastSubgroup = false;
        item.isInLastSubgroupOfGroup = false;
      }
      if (item.children) assignMeta(item.children, level + 1);
    }
  }

  const groupedArray = Array.from(groups.values());
  for (const group of groupedArray) sortChildren(group.children);
  attachParents([...topLevel, ...groupedArray]);
  assignMeta([...groupedArray, ...topLevel], 0);

  function cleanup(items) {
    for (const item of items) {
      delete item.__parent;
      if (item.children) cleanup(item.children);
    }
  }
  cleanup([...topLevel, ...groupedArray]);
  
  return [ ...groupedArray, ...topLevel];
}

const generateAvailabilityEvents = (currentDate, employees, events) => {
  const currentMonth = moment(currentDate).startOf('month')
  
  const employeesMap = employees.reduce((acc, emp) => {
    return {...acc, [emp.id]: emp}
  }, {})
  const arr = new Array(currentMonth.daysInMonth()).fill().map((_, i) => {
    const start = currentMonth.clone().add(i, 'days').startOf('day')
    const end = currentMonth.clone().add(i, 'days').endOf('day')

    const res = events.reduce((acc, event) => {
      const eventStart = moment(event.start)
      const eventEnd = moment(event.end)
      const isEventInDay = eventStart.isBefore(end) && eventEnd.isAfter(start) || eventStart.isSame(start) || eventEnd.isSame(end)
      if (isEventInDay) {
        acc.count += 1
        const existingPolicy = acc.policies[event.policy.id]
        if (!existingPolicy) {
          acc.policies[event.policy.id] = {
            color: event.policy.color || COLORS_JOB_TYPE[0],
            onLeave: 1,
            name: event.policy.name || 'Time Off',
            id: event.policy.id,
            symbol: event.policy.symbol,
            employees: [{...employeesMap[event.employee_id], color: getRandomHexColor()}]
          }
        } else {
          acc.policies[event.policy.id].onLeave += 1
          acc.policies[event.policy.id].employees.push({...employeesMap[event.employee_id], color: getRandomHexColor()})
        }
      }
      return acc
    }, {count: 0, policies: {}})
    
    const unavailableEmployees = res.count
    return {
      resourceId: 'availability',
      id: `availability-${i}`,
      start: start.toDate(),
      end: end.toDate(),
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      type: 'availability',
      metadata: {
        unavailableEmployees: unavailableEmployees,
        totalEmployees: employees.length,
        percentage: employees.length > 0 ? Math.round((unavailableEmployees / employees.length) * 100) : 0,
        chartData: {
          date: start.format('YYYY-MM-DD'),
          onLeave: unavailableEmployees,
          segments: Object.values(res.policies).map(item => {
            return {
              name: item.name,
              value: item.onLeave,
              symbol: item.symbol,
              seg: {
                  type: item.name,
                  count: item.onLeave,
                  employees: item.employees,
              },
              fill: item.color,
            }
          })
        }
      }
    }
  })
  return arr
}

const getCheckedElements = (items) => {
  const result = []

  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      if (item.checked) {
        result.push(item);
      }
    } else if ("children" in item) {
      const checkedChildren = getCheckedElements(item.children);

      if (checkedChildren.length > 0) {
        result.push({
          ...item,
          children: checkedChildren
        });
      }
    }
  }

  return result
}

const getCheckedEmployeeIds = (items) => {
  let ids = []
  for (const item of items) {
    if ("isEmployee" in item && item.isEmployee) {
      if (item.checked) ids.push(item.id)
    } else if ("children" in item) {
      ids = ids.concat(getCheckedEmployeeIds(item.children))
    }
  }
  return ids
}

const getCheckedOrAll = (items) => {
  const checked = getCheckedElements(items)
  if (checked.length === 0) {
    return items
  }
  return checked
}

const getRandomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16)
  return `#${randomColor.padStart(6, '0')}`;
}

const generateEvents = (data, policies) => {
  const policiesMap = policies.reduce((acc, policy) => {
    return {
      ...acc,
      [policy.id]: policy,
    }
  }, {})
  const arr = data.map(item => {
    const policy = policiesMap[item.policy_id] || {}
    return {
      id: item.id,
      start: moment(item.from).toDate(),
      end: moment(item.to).toDate(),
      resourceId: item.employee_id.toString(),
      policy: policy,
      employee_id: item.employee_id,
      backgroundColor: fade(policy.color || COLORS_JOB_TYPE[0], 0.5),
      borderColor: policy.color || COLORS_JOB_TYPE[0],
      title: policy.name || 'Time Off',
      classNames: [styles.event],
    }
  })
  return arr
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

const eventClassNames = ({ event }) => {
  if (event.extendedProps.type === 'availability') {
    return ['availability-event']
  }
  return ['']
}

const TimeOffCalendar = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const [timeline, setTimeline] = useState(TIMELINE.MONTH)
  const [currentStartDate, setCurrentStartDate] = useState(moment().startOf(timeline).format('YYYY-MM-DD'))
  const [places, setPlaces] = useState([])
  const [policies, setPolicies] = useState([])
  const [employees, setEmployees] = useState([])
  const [resources, setResources] = useState([])
  const [events, setEvents] = useState([])
  const [activeAvailability, setActiveAvailability] = useState(null)

  const fromDateRef = useRef(new Date())
  const calendarRef = useRef(null)
  const sideBarRef = useRef(null)
  
  useEffect(() => {
    getCompanyEmployeesAll(companyId).then(res => {
      const grouped = groupEmployees(res.users || [])
      setResources(grouped)
      setEmployees(res.users || [])
    })
    getCompanyTimeOffPolicies(companyId).then(res => {
      if (Array.isArray(res?.policies)) {
        setPolicies(res.policies.map(p => ({...p, checked: false, title: p.name, isEmployee: true})))
      }
    })
    getPlaces(companyId).then(res => {
      setPlaces(res.map(p => ({...p, title: p.name, isEmployee: true, checked: false})))
    })
  }, [companyId])

  useEffect(() => {
    if (employees.length && policies.length) {
      const params = {
        view: 'monthly',
        start_date: moment(currentStartDate).startOf('month').format('YYYY-MM-DD'),
        employees: getCheckedEmployeeIds(resources),
      }
      getEvents(params)
    }
  }, [currentStartDate, employees, policies, resources])

  const getEvents = (params) => {
    getCompanyTimeOffRequests(companyId, params).then(res => {
      if (Array.isArray(res?.request_behalf)) {
        const events = generateEvents(res.request_behalf, policies)
        setEvents([...events, ...generateAvailabilityEvents(currentStartDate, employees, events)])
      }
    })
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
  }, [employees.length])

  const handleChangeEmployeeFilter = useCallback((res) => {
    setResources(res)
  }, [])

  const handleChangePolicyFilter = useCallback((res) => {
    setPolicies(res)
  }, [])

  const handleChangePlaceFilter = useCallback((res) => {
    setPlaces(res)
  }, [])

  const renderResourceAreaHeaderContent = useCallback(({view}) => {
    const handleClickPrev = () => {
      view.calendar.prev()
      const targetDate = view.getCurrentData().currentDate
      if (timeline === TIMELINE.MONTH) {
        
        const date = moment(fromDateRef.current).startOf('month').subtract(1, 'days').startOf('month')
        fromDateRef.current = date.startOf('day').toDate()
        setCurrentStartDate(date.format('YYYY-MM-DD'))
      } else {
        fromDateRef.current = moment(targetDate).startOf('day').toDate()
        setCurrentStartDate(moment(targetDate).format('YYYY-MM-DD'))
      }
    }

    const handleClickNext = () => {
      view.calendar.next()
      const targetDate = view.getCurrentData().currentDate
      if (timeline === TIMELINE.MONTH) {
        const date = moment(fromDateRef.current).endOf('month').add(1, 'days')
        fromDateRef.current = date.startOf('day').toDate()
        setCurrentStartDate(date.format('YYYY-MM-DD'))
      } else {
        fromDateRef.current = moment(targetDate).startOf('day').toDate()
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

  const renderEventContent = useCallback(({event}) => {
    if (event.getResources()[0].id === 'availability') {
       return (
        <AvailabilityCard
          event={event}
          isActive={activeAvailability === event.id}
          onPress={(id) => handleChangeAvailability(id, event)} />
      )
    }
    return (
      <div className={styles.eventContent}>
      </div>
    )
   
  }, [activeAvailability])

  const renderMonthHeader = useCallback(({date: monthDate}) => {
    const date = moment(monthDate)
    return (
      <div onClick={() => handleClickDay(date)}>
        <span className='schedule-enter-day'>{ t('Go') }</span>
        { `${date.format('D')}` }
      </div>
    )
  }, [currentStartDate])

  return (
    <div className={styles.screen}>
      <div className={styles.toolsContainer}>
        <CustomSelect
          placeholder={t('All Places')}
          items={places}
          onChange={handleChangePlaceFilter}
          width='auto' />
        <CustomSelect
          placeholder={t('All Policies')}
          items={policies}
          onChange={handleChangePolicyFilter}
          width='auto' />
        <CustomSelect
          placeholder={t('All employees')}
          buttonLabel={t('Filter')}
          items={resources}
          onChange={handleChangeEmployeeFilter}
          width='auto' />
        <Tabs 
          selected={timeline}
          onChange={setTimeline}
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
      <div className="calendar-wrapper">
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
          // eventDurationEditable={timeline === TIMELINE.DAY}
          views={{
            ...CALENDAR_VIEWS_CONFIG,
            day: {
              ...CALENDAR_VIEWS_CONFIG.day,
              // slotMinTime: scheduleSettings.working_at_night ? scheduleSettings.time_view_stats : '00:00:00',
              // slotMaxTime: scheduleSettings.working_at_night ? `${+scheduleSettings.time_view_stats.split(':')[0] + 24}:00:00` : '24:00:00', 
            },
            week: {
              ...CALENDAR_VIEWS_CONFIG.week,
              // slotLabelFormat: renderWeekHeader,
            },
            month: {
              ...CALENDAR_VIEWS_CONFIG.month,
              slotLabelContent: renderMonthHeader,
              // slotLabelClassNames: ({date: monthDate, view}) => {
              //   const isNextMonth = moment(monthDate).isAfter(moment(currentStartDate).endOf('month'))
              //   const date = moment(monthDate)
              //   const holiday = schedule.holidays[date.date()]
              //   const isWeekend = date.day() === 6 || date.day() === 0
              //   return isNextMonth ? ['statistic-slot'] : holiday ? [isWeekend ? 'header-holiday-slot-weekend' : 'header-holiday-slot'] : []
              // },
              visibleRange: () => {
                const visibleRange = {
                  start: moment(currentStartDate).clone().startOf('month').toDate(),
                  end: moment(currentStartDate).clone().endOf('month').toDate(),
                }
                return visibleRange
              },
            },
          }}
          resources={[AVAILABILITY_RESOURCE, ...getCheckedOrAll(resources)]}
          events={events}
          eventContent={renderEventContent}
          eventClassNames={eventClassNames}
          // slotLaneClassNames={slotLaneClassNames}
          // slotLaneContent={renderSlotLaneContent}
          // resourceAreaHeaderClassNames={() => ['resource-area-header']}
          resourceAreaHeaderContent={renderResourceAreaHeaderContent}
          // resourceLaneContent={resourceLaneContent}
          resourceLabelClassNames={resourceLabelClassNames}
          resourceLaneClassNames={resourceLaneClassNames}
          resourceLabelContent={renderResourceLabelContent}
          // locale={localStorage.getItem('i18nextLng') || 'en'}
          // eventAllow={eventListener}
          // viewDidMount={handleViewDidMount}
        />
      </div>
      <PolicySideBar
        ref={sideBarRef}
        onClose={() => setActiveAvailability(null)} />
      <Tooltip
        id='user_avatar'
        arrowColor='transparent'
        style={{backgroundColor: 'transparent'}}
        place="right"
        effect='solid' />
    </div>
  )
}

export default TimeOffCalendar
