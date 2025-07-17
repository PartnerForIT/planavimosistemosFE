import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import moment from 'moment'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { fade } from '@material-ui/core/styles/colorManipulator'
import {Tooltip} from 'react-tooltip'

import '../Schedule/Schedule.scss'
import config from '../../config'
import { TIMELINE, COLORS_JOB_TYPE, COLORS_SHIFT } from '../../const'
import useGroupingEmployees from '../../hooks/useGroupingEmployees'
import { loadEmployeesAll } from '../../store/settings/actions'
import { getShiftTypes } from '../../store/shiftsTypes/actions'
import { getJobTypes } from '../../store/jobTypes/actions'
import usePermissions from '../../components/Core/usePermissions'

import HolidayIcon from '../../components/Core/HolidayIcon/HolidayIcon'
import Progress from '../../components/Core/Progress'
import MainLayout from '../../components/Core/MainLayout'
import CustomSelect from '../../components/Core/Select/Select'
import ButtonGroupToggle from '../../components/Core/ButtonGroupToggle'
import ResourceAreaHeader from '../Schedule/ResourceAreaHeader'
import EventContent from '../Schedule/EventContent'
import ResourceItem from '../Schedule/ResourceItem'
import DialogDeleteShift from '../../components/Core/Dialog/DeleteShift'
import DialogClearShift from '../../components/Core/Dialog/ClearShift'
import Footer from '../Schedule/Footer'
import CopyTool from '../Schedule/CopyTool'
import ToolsButton from '../../components/Core/ToolsButton/ToolsButton'
import FlatButton from '../../components/Core/FlatButton/FlatButton'
import ArrowEIPIcon from '../../components/Icons/ArrowEIPIcon'
import ExcelIcon from '../../components/Icons/ExcelIcon'
import Button from '../../components/Core/Button/Button'
import MonthCell from './MonthCell'
import AddTempEmployee from '../Schedule/AddTempEmployee'

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

const permissionsConfig = [
  {
    name: 'cost',
    module: 'cost_earning',
  },
  {
    name: 'schedule_costs',
    module: 'schedule_shift',
    permission: 'schedule_costs',
  },
  {
    name: 'schedule_create_and_edit',
    module: 'schedule_shift',
    permission: 'schedule_create_and_edit',
  },
  {
    name: 'night_rates',
    module: 'night_rates',
  },
]

const request = async (url, method, params) => {
  if (method === 'GET' && params) {
    url += '?' + new URLSearchParams(params).toString()
  }
  const res = await fetch(
    `${config.api.url}/company/${url}`,
    {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(params) : null,
    }
  )
  const data = await res.json()
  return data
}

const employToCheck = ({id,name,surname}) => ({
  id,
  label: `${name} ${surname}`,
})

const handleResourceLabelClassNames = ({ resource }) => {
  const { extendedProps: props } = resource;
  const classes = []
  if (props.lastShift) {
    classes.push('fc-datagrid-cell-last-shift');
  }
  if (props.lastJobType) {
    classes.push('fc-datagrid-cell-last-job-type');
  }
  if (props.place_id && !props.employeeId) {
    classes.push('fc-datagrid-cell-place');
  } else if (props.shiftId) {
    classes.push('fc-datagrid-cell-shift');
  } else if (props.job_type_id) {
    classes.push('fc-datagrid-cell-job-type');
  } else if (props.employeeId || props.employeeId === 0) {
    classes.push('fc-datagrid-cell-employee');
  }
  if (props.employee_type === 3 || props.employee_type === 2){
    classes.push('fc-datagrid-cell-empty');
  }
  return classes
}

const updateWidthCell = (rows) => {
  const scheduleFooter = document.getElementById('schedule-footer')
  if (scheduleFooter?.getAttribute('data-timeline') === TIMELINE.WEEK) {
    Array.from(rows).forEach((itemJ, index) => {
      const { width } = itemJ.getBoundingClientRect()
      
      if (scheduleFooter.children[index + 1]) {
        scheduleFooter.children[index + 1].style.width = `${width}px`
      }
    })
  }

  const allElements = document.querySelectorAll('.fc-timeline-slot')
  allElements.forEach((el) => {
    el.colSpan = 1
  })
  
  if (scheduleFooter?.getAttribute('data-timeline') === TIMELINE.MONTH) {
    
    const elments = document.querySelectorAll('.statistic-slot')
    elments.forEach((el) => {
      el.colSpan = 2
    })
  }
}

const generateStatisticEvents = (date, events) => {
  const totalTimeDate = moment(date).endOf('month').add(1, 'days')
  const totalCostDate = moment(date).endOf('month').add(2, 'days')
  const resourceEvents = events.reduce((acc, event) => {
    return {
      ...acc,
      [event.resourceId]: [...(acc[event.resourceId] || []), event]
    }
  }, {})

  const temp = Object.entries(resourceEvents).flatMap(([resourceId, events]) => {
    const accumulatedData = events.filter(e => !e.empty_event && !e.empty_manual && !e.empty_employee).reduce((acc, e) => {
      return {
        totalHours: acc.totalHours + (e.hours || 0),
        nightHours: acc.nightHours + (e.night_duration || 0),
        cost: acc.cost + (e.cost*1 || 0),
      }
    }, {
      totalHours: 0,
      nightHours: 0,
      cost: 0,
    })
    const totalTimeEvent = {
      start: totalTimeDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end: totalTimeDate.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      statistic: true,
      resourceId: resourceId,
      accumulatedData: accumulatedData,
    }
    const totalCostEvent = {
      start: totalCostDate.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end: totalCostDate.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      statistic: true,
      resourceId: resourceId,
      accumulatedData: {
        cost: accumulatedData.cost,
      },
    }
    return [totalTimeEvent, totalCostEvent]
  })

  return temp
}

const ScheduleV2 = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()

  const jobTypes = useSelector(state => state.jobTypes.jobTypes)
  const shiftsTypes = useSelector(state => state.shiftTypes)
  const { users: employees } = useSelector(state => state.settings.employees)
  const user = useSelector(state => state.auth.user)
  const copyToolHistory = useSelector(state => state.copyTool.history)

  const permissions = usePermissions(permissionsConfig)
  
  const [scheduleSettings, setScheduleSettings] = useState({
    clock_in_restriction: false,
    ignore_clockin_restriction: false,
    working_at_night: false,
    place_timeline: false,
    use_publish: false,
    group_timeline: false,
    subgroup_timeline: false,
    shift_timeline: false,
    job_timeline: false,
    request_dayoff: true,
    use_empty_hours: true,
    ignore_empty_hours_logbook_edit: false,
    deduct_break: true,
    break_from_job: false,
    use_accumulated: true,
    accumulated_from_country: true,
    use_em_status: true,
    deduct_break_accumulated: false,
    accumulated_months: 1,
    accumulated_start: 1,
    start_finish: true,
    remove_timelines: true,
    work_night_excel: true,
    time_view_stats: "00:00",
    clock_in_minutes: 5
  })
  const [additionalRates, setAdditionalRates] = useState({
    night_time: true,
    night_time_time_start: "22:00",
    night_time_time_end: "06:00",
    night_time_type: 2,
    night_time_rate: 1.5,
    holiday: true,
    holiday_company: false,
    holiday_type: 2,
    holiday_rate: 2,
    holiday_night_type: 2,
    holiday_night_rate: 2,
    is_current: true,
    ignore_holiday_night_time: true
  })
  const [timeline, setTimeline] = useState(TIMELINE.MONTH)
  const [toolsActive, setToolsActive] = useState({ marking: false, start_finish: false, remove_timelines: false})
  const [filter, setFilter] = useState({employers: [], place: [], shiftType: []})
  const [currentStartDate, setCurrentStartDate] = useState(moment().startOf(timeline).format('YYYY-MM-DD'))
  const [schedule, setSchedule] = useState({holidays: {}, resources: [], events: [], markers: [], timesPanel: {}, loading: false})
  const [workTimes, setWorkTimes] = useState({})
  const [copyTool, setCopyTool] = useState(false)
  const [copyToolTime, setCopyToolTime] = useState({})
  const [activeDrag, setActiveDrag] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [clearConfirmation, setClearConfirmation] = useState(false)
  const [deletedShiftName, setDeletedShiftName] = useState('')
  const [modalAddTempEmployee, setmodalAddTempEmployee] = useState(null)
  const [tempShiftID, setTempShiftID] = useState(0)
  const [tempEventID, setTempEventID] = useState(0)

  const calendarRef = useRef(null)
  const fromDateRef = useRef(new Date())
  const resizeObserverRef = useRef()
  const copyToolRef = useRef()

  const allSortedEmployees = useGroupingEmployees(employees, employToCheck)

  const resources = useMemo(() => {
    let currentColor = 0
    let colorType = 'bright'

    const updateChildren = (children, upLastShift, upLastJobType, upCustomTime) => {
      if (children) {
        return Object.values(children).map((item, index) => {
          const lastShift = upLastShift || (item.shiftId && ((children.length - 1) === index))
          const customTime = upCustomTime || item.custom_time
          const lastJobType = upLastJobType || (item.job_type_id && ((children.length - 1) === index))
      

          if (item.shiftId) {
            item.count = item.count || 0;
            item.children.forEach((i) => {
              item.count = item.count + i.children.length
              return i
            })
          }
          if (item.job_type_id) {
            item.count = item.children.length;
          }

          let eventBackgroundColor = item.color;
          let eventBorderColor = item.color;
          let lineColor = false;

          if (item.place_id){
            eventBorderColor = COLORS_JOB_TYPE[colorType][217];
            eventBackgroundColor = fade(COLORS_JOB_TYPE[colorType][217], 0.5);
          }
          if (item.shiftId) {
            colorType = COLORS_SHIFT.bright.some((itemC) => itemC === item.color) ? 'bright' : 'calm';
            eventBorderColor = COLORS_SHIFT[colorType][currentColor];
            eventBackgroundColor = COLORS_SHIFT[colorType][currentColor];
          }

          if (item.job_type_id) {
            if (currentColor >= COLORS_JOB_TYPE[colorType].length) {
              currentColor = 0;
            }

            eventBorderColor = COLORS_JOB_TYPE[colorType][currentColor];
            eventBackgroundColor = COLORS_JOB_TYPE[colorType][currentColor];
            currentColor += 1;
          }

          if (item.employeeId) {
            eventBorderColor = COLORS_JOB_TYPE[colorType][currentColor - 1];
            eventBackgroundColor = fade(COLORS_JOB_TYPE[colorType][currentColor - 1], 0.5);
          }
          if (item.employee_type === 3|| item.employee_type === 2 || item.empty_event) {
            eventBorderColor = COLORS_JOB_TYPE[colorType][216];
            eventBackgroundColor = fade(COLORS_JOB_TYPE[colorType][216], 0.5);
          }

          if ((scheduleSettings.remove_timelines && timeline === TIMELINE.WEEK) || timeline === TIMELINE.MONTH) {
            lineColor = eventBackgroundColor
            eventBorderColor = 'transparent'
            eventBackgroundColor = 'transparent'
          }
          
          return {
            ...item,
            eventBackgroundColor,
            eventBorderColor,
            lineColor,
            order: index,
            durationEditable: schedule.events[0]?.is_completed ? false : !!item.employeeId,
            lastShift: lastShift,
            lastJobType: lastJobType,
            children: updateChildren(item.children, lastShift, lastJobType, customTime),
          }
        })
      }
      return []
    }

    return updateChildren(schedule.resources)
  }, [schedule.resources, schedule.events, scheduleSettings.remove_timelines, timeline])

  const events = useMemo(() => {
    let result = []
    if (scheduleSettings.remove_timelines && timeline === TIMELINE.WEEK) {
      result = schedule?.events.map((e) => ({
        ...e,
        realStart: e.start,
        realEnd: e.end,
        start: e.empty_manual ? e.start : moment(e.start).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        end: e.empty_manual ? e.end : moment(e.start).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      }));
    } else if (timeline === TIMELINE.DAY) {
      result = schedule?.events
        .filter((e) => !(!e.employee_id && !moment(e.start).isSame(moment(fromDateRef.current), 'day')))
        .map(e => {
          const startOfDay = moment().startOf('day')
          const editable = moment(e.start, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(startOfDay) && !e.rId
          if (e.empty_manual && scheduleSettings.working_at_night) {
            const start = moment(e.start, 'YYYY-MM-DD HH:mm:ss')
            const startStr = `${start.format('YYYY-MM-DD')} ${scheduleSettings.time_view_stats}:00`
            const endStr = `${moment(startStr).add(24, 'hours').format('YYYY-MM-DD HH:mm:ss')}`
            const times = {
              start: startStr,
              end: endStr,
            }
            
            return {
              ...e,
              identifier: e.id,
              durationEditable: editable,
              ...times,
            }
          }
          return {
            ...e,
            identifier: e.id,
            durationEditable: editable
          }
        })
    } else {
      result = schedule?.events
    }

    if (timeline === TIMELINE.WEEK) {
      result = result.map(e => ({...e, realStart: e.start, realEnd: e.end}))
    }

    if (timeline === TIMELINE.MONTH) {
      result = [...result, ...generateStatisticEvents(fromDateRef.current, schedule.events)].map(e => {
        return {
          ...e,
          realStart: e.start,
          realEnd: e.end,
          end: moment(e.start).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
      })
    }

    result = result.map(e => {
      const eventWeekDay = moment(e.start).isoWeekday()
      return {
        ...e,
        defaultTimes: {
          start: workTimes[eventWeekDay] ? moment(workTimes[eventWeekDay].start, 'HH:mm').format('YYYY-MM-DD HH:mm:ss') : '08:00',
          end: workTimes[eventWeekDay] ? moment(workTimes[eventWeekDay].finish, 'HH:mm').format('YYYY-MM-DD HH:mm:ss') : '17:00',
        },
      }
    })

    return [
      ...result.filter((resultItem) => {
        return !copyToolHistory.some((historyItem) => (
          resultItem.start <= historyItem.end &&
          resultItem.end >= historyItem.start &&
          resultItem.resourceId === historyItem.resourceId
        ))
      }),
      ...copyToolHistory.map((e) => ({...e, copy_event: true})),
    ]
  }, [schedule.events, copyToolHistory, timeline, scheduleSettings, workTimes])

  const daysOfMonth = useMemo(() => {
    const currentMonth = moment().startOf('month')
    const day = currentMonth.clone().add(-1, 'days')
    const arr = new Array(currentMonth.daysInMonth()).fill().map((_, index) => {
      const dayNumber = day.add(1, 'days').day()
      const currentDay = moment()
  
      return {
        id: index + 1,
        title: index + 1,
        weekend: dayNumber === 6 || dayNumber === 0,
        today: currentDay.isSame(day, 'day'),
        holiday: schedule.holidays && schedule.holidays[index + 1] ? schedule.holidays[index + 1] : false,
        markers: schedule.markers.filter((marker) => day.isSame(moment(marker.date), 'day'))
      }
    })
    arr.push({
      id: 'totalTime',
      title: t('Total Time'),
      statistic: true,
    })
  
    if (permissions.cost && permissions.schedule_costs) {
      arr.push({
        id: 'totalCost',
        title: t('Total Cost'),
        statistic: true,
      })
    }
  
    return arr
  }, [permissions.cost, permissions.schedule_costs, schedule.holidays, schedule.markers])

  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (companyId) {
      init(companyId)
    }
  }, [companyId])

  useEffect(() => {
    getSchedule({type: timeline, formDate: currentStartDate})
  }, [companyId, timeline, currentStartDate, filter])

  useEffect(() => {
    if (timeline === TIMELINE.WEEK || timeline === TIMELINE.MONTH) {
      handleViewDidMount()
    }
  }, [timeline, currentStartDate])

  useEffect(() => {
    fromDateRef.current = moment(currentStartDate).toDate()
  }, [currentStartDate])

  const init = async (companyId) => {
    dispatch(loadEmployeesAll(companyId, {page: 'schedule'}))
    dispatch(getJobTypes(companyId))
    dispatch(getShiftTypes(companyId))
    const promisses = [
      request(`${companyId}/schedule/settings`),
      request(`${companyId}/logbook/additional-rates`),
      request(`${companyId}/work-time`)
    ]
    const [scheduleSettingsRes, additionalRatesRes, workTimeRes] = await Promise.all(promisses)
    if (scheduleSettingsRes) {
      setScheduleSettings(scheduleSettingsRes)
      setToolsActive(state => {
        return {
          ...state,
          remove_timelines: scheduleSettingsRes.remove_timelines,
          start_finish: scheduleSettingsRes.start_finish,
        }
      })
    }
    if (additionalRatesRes) {
      setAdditionalRates(additionalRatesRes)
    }
    if (Array.isArray(workTimeRes?.work_time?.work_days?.days)) {
      setWorkTimes(workTimeRes.work_time.work_days.days.reduce((acc, item) => ({
        ...acc,
        [item.day]: item
      }), {}))
    }
  }

  const changeView = (viewtype, date) => {
    calendarRef.current.getApi().changeView(viewtype, date)
    setTimeline(viewtype)
  }

  const getSchedule = async ({type, formDate}) => {
    const params = {
      type: type,
      from_date: formDate,
      shiftTypeArr: filter.shiftType.map(({id}) => id),
      employeesArr: filter.employers.map(({id}) => id),
      placesArr: filter.place.map(({id}) => id),
    }
    setSchedule(prev => ({...prev, loading: true}))
    const res = await request(`${companyId}/shift`, 'GET', params)
    if (res.success) {
      const events = res.events.map(e => {
        if (e.rId) {
          e.resourceId = e.rId
        }
        return e
      })
      setSchedule(state => ({
        accumulatedHours: res.accumulatedHours,
        holidays: Object.keys(res.holidays).length ? res.holidays : state.holidays,
        events: events,
        markers: res.markers,
        resources: res.resources,
        timesPanel: res.timesPanel,
        loading: false,
      }))
    }
  }
  
  const handleViewDidMount = (info) => {
    const container = document.getElementsByClassName('fc-timeline-slots')
    resizeObserverRef.current = new ResizeObserver((item) => {
      const rows = item[0].target.children[0].children[1].children[0].children
      updateWidthCell(rows)
    }).observe(container[0], { box: 'border-box' });
  }
  
  const getResourceTitle = (viewType, date) => {
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
  }

  const onPlaceSelectFilter = (place) => {
    const arrChecked = place?.filter((i) => i.checked)
    setFilter((prevState) => ({
      ...prevState,
      place: arrChecked,
    }))
  }

  const onShiftSelectFilter = (shift) => {
    const arrChecked = shift?.filter((i) => i.checked)
    setFilter((prevState) => ({
      ...prevState,
      shiftType: arrChecked,
    }))
  }

  const onEmployeesSelectFilter = (emp) => {
    const arrChecked = emp?.filter((i) => i.checked)
    setFilter((prevState) => ({
      ...prevState,
      employers: arrChecked,
    }))
  }

  const handleChangeTimeline = (view) => {
    const startDate = view === TIMELINE.MONTH ? moment().startOf('month') : view === TIMELINE.WEEK ? moment().startOf('isoWeek') : moment()
    changeView(view, startDate.toDate())
    setCurrentStartDate(startDate.format('YYYY-MM-DD'))
  }

  const handleEventClassNames = (info) => {
    let classes = []
    if (info.event.extendedProps.empty_manual) {
      classes.push('is-empty-manual')
    }
    if (copyTool || info.event.extendedProps.copy_event) {
      classes.push('disable-drag')
    }
    return classes
  }

  const handeSlotLaneClassNames = (info) => {
    const date = moment(info.date);
    const holiday = (schedule?.holidays) ? schedule?.holidays[date.date()] : false;
    const h = (holiday && holiday[0] && holiday[0]?.date) ? holiday[0] : {};
    let result = '';
    const isNextMonth = date.isAfter(moment(currentStartDate).endOf('month'))
    if (isNextMonth && timeline === TIMELINE.MONTH) {
      return 'statistic-slot'
    }
    if (timeline !== TIMELINE.DAY && h.date) {
      result += 'cell_holiday ';
      if (h.company_work_time_id) {
        result += 'cell_holiday_company';
      } else if ((h.date && !h.company_work_time_id)) {
        result += 'cell_holiday_government';
        
      }
    }

    const isPastDay = date.isBefore(moment().startOf('day'))

    if (isPastDay) {
      result += ' cell_past_day'
    }
    
    
    return result;
  }

  const eventListener = (dropInfo, event) => {
    const start = moment(dropInfo.start)
    const end = moment(dropInfo.end)
    setSchedule(prev => ({
      ...prev,
      events: prev.events.map(e => {
        if (event.extendedProps.identifier === e.id) {
          return {
            ...e,
            title: `${start.format('HH:mm')}-${end.format('HH:mm')}`,
            start: start.format('YYYY-MM-DD HH:mm'),
            end: end.format('YYYY-MM-DD HH:mm'),
          }
        }
        return e
      })
    }))
    return true
  }

  const handleEventChange = ({ event }) => {
    const resourceInfo = event.getResources()[0]
    const [shiftId] = resourceInfo.id.split('-')
    handleChangeWorkingTime({
      id: event.id,
      shiftId,
      time: {
        start: moment(event.start),
        end: moment(event.end),
      },
    })
  }

  const handleEventChangeStart  = ({ event }) => {
    setActiveDrag(event.getResources()[0]?.id)
  }
  
  const handleEventChangeStop  = () => {
    setActiveDrag('')
  }

  const handleCopyTool = (time) => {
    setCopyToolTime(time)
    setCopyTool(!copyTool)
  }

  const handleCloseCopyTool = () => {
    setCopyTool(false)
  }

  const handleAddHistory = (data) => {
    copyToolRef.current.addHistory(data)
  }

  const handleAddTimelinesHistory = async history => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/add_timelines`, 'PATCH', {
      data: history,
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleClickDay = (date) => {
    const calendarApi = calendarRef.current?.getApi()
    if (calendarApi) {
      calendarApi.changeView(TIMELINE.DAY, date.format('YYYY-MM-DD'))
      setCurrentStartDate(date.format('YYYY-MM-DD'))
      setTimeline(TIMELINE.DAY)
    }
  }

  const handleChangeWorkingTime = async ({shiftId, id, time}) => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/${shiftId}/change/timeline`, 'PATCH', {
      dateTime_start: time.start.format('YYYY-MM-DD HH:mm'),
      dateTime_end: time.end.format('YYYY-MM-DD HH:mm'),
      data: id,
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleChangeEmployee = async ({employeeId, shiftId, id}) => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/${shiftId}/change/employee`, 'PATCH', {
      employee_id: employeeId,
      data: id,
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleAddWorkingTime = async ({ shiftId, id, time }) => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/${shiftId}/add/timeline`, 'PATCH', {
      dateTime_start: time.start.format('YYYY-MM-DD HH:mm'),
      dateTime_end: time.end.format('YYYY-MM-DD HH:mm'),
      data: id,
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleDeleteShift = async (shiftId) => {
    handleCloseDialog()
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/delete/${shiftId}`, 'DELETE')
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleDeleteTimeline = async ({ id, shiftId }) => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/${shiftId}/delete/timeline/${id}`, 'DELETE')
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleGenerateTimes = async (shiftId, employeeId) => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/${shiftId}/generate-times`, 'PATCH', {
      from_date: currentStartDate,
      type: timeline,
      employee_id: employeeId,
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleClearTimes = async (shiftId, employeeId) => {
    setClearConfirmation(false)
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/${shiftId}/clear-times`, 'PATCH', {
      from_date: currentStartDate,
      type: timeline,
      employee_id: employeeId,
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleMarker = useCallback(async (employeeId, date) => {
    await request(`${companyId}/marker`, 'PATCH', {
      employeeId,
      date: date.format('YYYY-MM-DD'),
    })
    getSchedule({type: timeline, formDate: moment(fromDateRef.current).format('YYYY-MM-DD')})
  }, [companyId])

  const addTempEmployeeDispatch = async (selectedEmployee) => {
    setSchedule(prev => ({...prev, loading: true}))
    await request(`${companyId}/shift/add-assistant/${tempShiftID}`, 'POST', {
      employee_id: selectedEmployee,
      data: tempEventID
    })
    getSchedule({type: timeline, formDate: currentStartDate})
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setDeletedShiftName('')
  }

  const handleChangeTool = async ({ target: {name, checked} }) => {
    setToolsActive(state => ({...state, [name]: checked }))
    if (name === 'start_finish' || name ==='remove_timelines') {
      setSchedule(prev => ({...prev, loading: true}))
      const res = await request(`${companyId}/schedule/settings/edit`, 'POST', { ...toolsActive, [name]: checked })
      if (res) {
        const settingsRes = await request(`${companyId}/schedule/settings`)
        if (settingsRes) {
          setScheduleSettings(settingsRes)
        }
      }
      setSchedule(prev => ({...prev, loading: false}))
    }
  }

  const downloadScheduleFile = async (type) => {
    let nextFromDate = moment(fromDateRef.current)
    if (timeline === TIMELINE.WEEK) {
      nextFromDate = nextFromDate.startOf('isoWeek')
    }
    const data = {
      downloadType: type,
      shiftTypeArr: filter?.shiftType.map(({id}) => id),
      employeesArr: filter?.employers.map(({id}) => id),
      placesArr: filter?.place.map(({id}) => id),
    }
    const res = await request(`${companyId}/shift/download?type=${timeline}&from_date=${nextFromDate.format('YYYY-MM-DD')}`, 'POST', data)
    const link = document.createElement('a')
    link.setAttribute('download', res.file)
    link.setAttribute('target', '_blank')
    link.href = `${res.path}`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleCreateNewShift = () => {
    history.push(`/${companyId}/schedule/shift/create`)
  }

  const getShiftName = (id) => {
    const name = shiftsTypes?.shiftTypes?.find((i) => i.id === id)?.name
    return name || ''
  }

  const addTempEmployees =  (shiftId, eventId) => {
    setmodalAddTempEmployee(data => !data)
    setTempShiftID(shiftId)
    setTempEventID(eventId)
  }

  const checkIfEventsExist = useCallback((shiftId, employeeId) => {
    if (!events || !shiftId) return false;

    const selectedEvent = events.find((e) => {
      const ids = e.resourceId.toString().split('-');
      const check = ids && ids[0] && ids[0].toString() === shiftId.toString() && (!employeeId  || employeeId.toString() === (e?.employee_id || '' ).toString()) && e.employee_id && !e.empty_employee && !e.empty_event && !e.empty_manual
      if (check) {
        if (e.start === e.end) {
          return false
        }
      }
      return check
    })
    
    return !!selectedEvent
  }, [events])

  const unavailableEmployees = useCallback(() => {
    const selectedEvent = events.find(e => e.id == tempEventID)
    if (selectedEvent) {
      const allEmployees = events.filter(e => e.empty_employee === false && e.resourceId.indexOf(tempShiftID+'-') == 0 && selectedEvent.day_number == e.day_number)
      return allEmployees.map(e => e?.new_employee?.id ? e?.new_employee?.id*1 : e.employee_id*1)
    }
    return []
  }, [events, tempShiftID, tempEventID])

  const renderResourceLaneContent = useCallback(({resource}) => {
    if (resource.extendedProps.employeeId) {
      const current_markers = schedule.markers.filter(m => m.employee_id*1 === resource.extendedProps.employeeId*1)
      if (current_markers.length) {
        const resourceEvents = schedule.events.filter(e => e.resourceId === resource.id && !e.empty_manual)
        const eventsByDate = resourceEvents.reduce((acc, e) => {
          return {
            ...acc,
            [moment(e.start).format('YYYY-MM-DD')]: true
          }
        }, {})
        return (
          <React.Fragment>
            {
              current_markers.map((marker, i) => {
                const existEvent = eventsByDate[moment(marker.date).format('YYYY-MM-DD')]
                if (existEvent) {
                  return null
                }
                const date_header = document.querySelector('.fc-timeline-slot-label[data-date^="'+moment(marker.date).format('yyyy-MM-DD')+'"]')
                if (!date_header) {
                  return null
                }
                return (
                  <div key={i} data-tooltip-id='user_marker' data-tooltip-html={marker.comment} className="fc-markers-item marked" style={{ width: date_header.offsetWidth, left: date_header.offsetLeft+1 }} data-mark={moment(marker.date).format('yyyy-MM-DD')}>
                  </div>
                )
              })
            }
          </React.Fragment>
        )
      }
    }
    return <React.Fragment />
  }, [schedule.markers, schedule.events])

  const renderMonthHeader = useCallback(({date: monthDate}) => {
    const date = moment(monthDate)
    const holiday = schedule.holidays[date.date()]
    const isNextMonth = date.isAfter(moment(currentStartDate).endOf('month'))

    if (isNextMonth) {
      if (date.date() === 1) {
        const wordsTotalTime = t('Total Time').split(' ')
        return (
          <>
            {
              wordsTotalTime.map((w, i) => {
                return <div key={i} style={{fontSize: 11}}>{w}</div>
              })
            }
          </>
        )
      } else {
        const wordsTotalCost = t('Total Cost').split(' ')
        return (
          <>
            {
              wordsTotalCost.map((w, i) => {
                return <div key={i} style={{fontSize: 11}}>{w}</div>
              })
            }
          </>
        )
      }
    }

    return (
      <div onClick={() => handleClickDay(date)}>
        <span className='schedule-enter-day'>{ t('Go') }</span>
        { `${date.format('D')}` }
        <HolidayIcon holidays={holiday} month={true} />
      </div>
    )
  }, [schedule.holidays, currentStartDate])

  const renderWeekHeader = useCallback(({date: weekDate}) => {
    const date = moment(weekDate)
    const holiday = schedule.holidays[date.date()]

    return (
      <div onClick={() => handleClickDay(date)}>
        <span className='schedule-enter-day'>{ t('Enter') }</span>
        { `${t(date.format('ddd'))}${date.format(', DD')}` }
        <HolidayIcon holidays={holiday} month={true} />
      </div>
    )
  }, [schedule.holidays])

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

    const holiday = (view.type === 'day' && schedule?.holidays) ? schedule?.holidays[inputDate.date()] : false
    const title = getResourceTitle(view.type, inputDate)
    return (
      <ResourceAreaHeader
        title={title}
        holiday={holiday}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext} />
    )
  }, [schedule.holidays, timeline, currentStartDate])

  const renderSlotLaneContent = useCallback(({date}) => {
    const d = moment(date)
    const isWeekend = d.day() === 6 || d.day() === 0
    if (isWeekend) {
      return (
        <div
          className="weekend-slot"
        />
      )
    }
    return <div />
  }, [])

  const renderResourceLabelContent = useCallback(({fieldValue, resource}) => {
    const {
      photo,
      shiftId,
      employeeId,
      employeesCount,
      jobTypeId,
    } = resource.extendedProps
    const realCount = employeesCount
    const accumulatedHoursDetected = schedule.accumulatedHours[employeeId+'-'+jobTypeId] ? schedule.accumulatedHours[employeeId+'-'+jobTypeId] : (schedule.accumulatedHours[employeeId] ? schedule.accumulatedHours[employeeId] : []);
    const [employeeShiftId] = resource._resource.id.toString().split('-')

    return (
      <ResourceItem
        title={`${fieldValue} ${realCount ? `(${realCount})` : ''}`} // ${resource.id}
        photo={photo}
        templateId={resource.extendedProps.template_id}
        accumulatedHours={accumulatedHoursDetected}
        shiftId={shiftId}
        withMenu={(permissions.schedule_create_and_edit || user.employee?.shift_id === shiftId) && (shiftId || employeeId && resource.extendedProps.template_id && timeline === TIMELINE.MONTH)}
        employeeId={employeeId}
        onEditShift={() => history.push(`/${companyId}/schedule/shift/${resource.extendedProps.template_id || shiftId}`)}
        onDeleteShift={() => {
          setOpenDialog(shiftId)
          setDeletedShiftName(fieldValue)
        }}
        canClearTimesForShift={shiftId && resource.extendedProps.template_id && checkIfEventsExist(shiftId, employeeId)}
        onGenerateTimes={checkIfEventsExist(employeeShiftId, employeeId) ? false : () => handleGenerateTimes(shiftId || employeeShiftId, employeeId)}
        onClearTimes={(fullShift) => {
          if (fullShift) {
            setClearConfirmation({shiftId: shiftId, employeeId: employeeId, shift: getShiftName(shiftId), month: moment(fromDateRef.current).format('MMMM')})
            return
          }
          setClearConfirmation({shiftId: employeeShiftId, employeeId: employeeId, shift: getShiftName(employeeShiftId), month: moment(fromDateRef.current).format('MMMM')})
        }}
      />
    );
  }, [schedule.accumulatedHours, permissions.schedule_create_and_edit, timeline])

  const renderEventContent = useCallback(({event, timeText, view}) => {
    if (schedule.loading) {
      return <div></div>
    }
    
    const resourceInfo = event.getResources()[0]
    const selectedEvent = event.extendedProps
    const start = (scheduleSettings.remove_timelines && timeline !== TIMELINE.DAY && selectedEvent.realStart) ? selectedEvent.realStart : event.start
    const end = (scheduleSettings.remove_timelines && timeline !== TIMELINE.DAY && selectedEvent.realEnd) ? selectedEvent.realEnd : ((timeline === TIMELINE.MONTH && selectedEvent.realEnd) ? selectedEvent.realEnd : event.end)
    const employeeName = resourceInfo.title
    const withMenu = resourceInfo.extendedProps.employeeId || resourceInfo?.extendedProps?.employeeId === 0
    const shiftId = resourceInfo.extendedProps.shift_id ? resourceInfo.extendedProps.shift_id : resourceInfo.id.split('-')[0]

    const isCanEdit = (() => {
      const place_id = selectedEvent?.place_id;
      const splited = resourceInfo?.id?.toString().split('-');
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
  
      return permissions.schedule_create_and_edit
    })()

    const unEmployees = schedule.events.reduce((acc, e) => {
      if (e.empty_employee === false && e.resourceId.indexOf(shiftId+'-') === 0 && selectedEvent.day_number === e.day_number) {
        return [...acc, Number(e?.new_employee?.id ? e?.new_employee?.id : e.employee_id)]
      }
      return acc
    }, [])
    const isNextMonth = moment(start).isAfter(moment(currentStartDate).endOf('month'))
    if (isNextMonth) {
      if (moment(start).date() === 1 && 'totalHours' in (selectedEvent.accumulatedData || {})) {
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontFamily: "Helvetica Neue Medium"}}>
            <div style={{color: '#333945', fontSize: 11, fontWeight: 'bold'}}>{selectedEvent.accumulatedData.totalHours}</div>
            <div style={{color: '#db894f', fontSize: 11, fontWeight: 'bold', borderTop: '1px solid #db894f'}}>{selectedEvent.accumulatedData?.nightHours}h</div>
          </div>
        )
      }
      if (moment(start).date() === 2 && 'cost' in (selectedEvent.accumulatedData || {})) {
        return (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontFamily: "Helvetica Neue Medium"}}>
            <div style={{color: '#333945', fontSize: 11, fontWeight: 'bold'}}>
              { selectedEvent.accumulatedData.cost.toFixed(2) }
            </div>
          </div>
        )
      }
      if (timeline === TIMELINE.MONTH) {
        return (
          <div />
        )
      }
    }

    if (timeline === TIMELINE.MONTH) {
      return (
        <MonthCell
          selectedEvent={selectedEvent}
          schedule={scheduleSettings}
          id={event.id}
          shiftId={shiftId}
          employeeId={resourceInfo?.extendedProps?.employeeId}
          title={event.title}
          employeeName={employeeName}
          timeText={timeText}
          start={start}
          end={end}
          resourceId={resourceInfo.id}
          copy_event={event.extendedProps.copy_event}
          empty={event.extendedProps.empty_event}
          empty_manual={event.extendedProps.empty_manual}
          nightDuration={timeline === TIMELINE.MONTH && selectedEvent.night_duration}
          newEmployee={event.extendedProps.new_employee}
          oldEmployee={event.extendedProps.old_employee}
          cost={event.extendedProps.cost}
          night_minutes={event.extendedProps.night_minutes}
          break_minutes={event.extendedProps.break_minutes}
          work_minutes={event.extendedProps.work_minutes}
          minutes={selectedEvent.minutes}
          costPermission={permissions.cost && permissions.schedule_costs}
          nightPermission={permissions.night_rates && additionalRates.night_time}
          viewType={view.type}
          photo={resourceInfo.extendedProps.photo}
          withMenu={withMenu && !copyTool && isCanEdit}
          jobTypeName={resourceInfo.extendedProps.job_type_name}
          copyTool={copyTool}
          endDay={event.endStr}
          editPermissions={isCanEdit}
          isCompleted={event?._def?.extendedProps?.is_completed}
          activeDrag={activeDrag === resourceInfo.id}
          unavailableEmployees={unEmployees}
          markers={schedule.markers}
          removeTimelines={(scheduleSettings.remove_timelines && timeline === TIMELINE.WEEK) || timeline === TIMELINE.MONTH}
          showHoursCount={timeline === TIMELINE.MONTH && !scheduleSettings.start_finish}
          lineColor={resourceInfo?.extendedProps?.lineColor}
          onChangeWorkingTime={handleChangeWorkingTime}
          onChangeEmployee={handleChangeEmployee}
          addTimeline={handleAddWorkingTime}
          onDeleteTimeline={handleDeleteTimeline}
          handleCopyTool={handleCopyTool}
          handleAddHistory={handleAddHistory}
          isMarkerMode={toolsActive.marking}
          addEmployee={() => addTempEmployees(shiftId, event.id)}
          handleMarker={handleMarker} />
      )
    }
    return (
      <EventContent
        id={event.id}
        selectedEvent={selectedEvent}
        shiftId={shiftId}
        employeeId={resourceInfo?.extendedProps?.employeeId}
        title={event.title}
        employeeName={employeeName}
        timeText={timeText}
        start={start}
        end={end}
        resourceId={resourceInfo.id}
        copy_event={event.extendedProps.copy_event}
        empty={event.extendedProps.empty_event}
        empty_manual={event.extendedProps.empty_manual}
        nightDuration={timeline === TIMELINE.MONTH && selectedEvent.night_duration}
        newEmployee={event.extendedProps.new_employee}
        oldEmployee={event.extendedProps.old_employee}
        cost={event.extendedProps.cost}
        night_minutes={event.extendedProps.night_minutes}
        break_minutes={event.extendedProps.break_minutes}
        work_minutes={event.extendedProps.work_minutes}
        minutes={event.extendedProps.minutes}
        costPermission={permissions.cost && permissions.schedule_costs}
        nightPermission={permissions.night_rates && additionalRates.night_time}
        viewType={view.type}
        photo={resourceInfo.extendedProps.photo}
        withMenu={withMenu && !copyTool && isCanEdit}
        jobTypeName={resourceInfo.extendedProps.job_type_name}
        copyTool={copyTool}
        endDay={event.endStr}
        editPermissions={isCanEdit}
        isCompleted={event?._def?.extendedProps?.is_completed}
        activeDrag={activeDrag === resourceInfo.id}
        unavailableEmployees={unEmployees}
        markers={schedule.markers}
        removeTimelines={(scheduleSettings.remove_timelines && timeline === TIMELINE.WEEK) || timeline === TIMELINE.MONTH}
        showHoursCount={timeline === TIMELINE.MONTH && !scheduleSettings.start_finish}
        lineColor={resourceInfo?.extendedProps?.lineColor}
        onChangeWorkingTime={handleChangeWorkingTime}
        onChangeEmployee={handleChangeEmployee}
        addTimeline={handleAddWorkingTime}
        onDeleteTimeline={handleDeleteTimeline}
        handleCopyTool={handleCopyTool}
        handleAddHistory={handleAddHistory}
        addEmployee={() => addTempEmployees(shiftId, event.id)}
      />
    )
  }, [permissions, scheduleSettings, timeline, activeDrag, schedule, copyTool, toolsActive.marking])

  return (
    <MainLayout>
      <div className='schedule-screen'>
        <div className='schedule-screen__header'>
          <CustomSelect
            placeholder={t('All job types')}
            buttonLabel={t('Filter')}
            items={jobTypes}
            onChange={onPlaceSelectFilter}
            width='auto'
            withSearch={true} />
          <CustomSelect
            placeholder={t('All shifts')}
            buttonLabel={t('Filter')}
            items={shiftsTypes?.shiftTypes}
            onChange={onShiftSelectFilter}
            width='auto'
            withSearch={true} />
          <CustomSelect
            placeholder={t('All employees')}
            buttonLabel={t('Filter')}
            items={allSortedEmployees ?? []}
            onChange={onEmployeesSelectFilter}
            width='auto'
            withSearch={true} />
          <ButtonGroupToggle
            buttons={[
              {
                label: t('Day'),
                id: TIMELINE.DAY,
              },
              {
                label: t('Week'),
                id: TIMELINE.WEEK,
              },
              {
                label: t('Month'),
                id: TIMELINE.MONTH,
              },
            ]}
            onChange={handleChangeTimeline}
            value={timeline}
          />
          {
            !copyTool
              ? <ToolsButton handleInputChange={handleChangeTool} values={toolsActive} style={{height: '100%'}} />
              : null
          }
          {
            timeline === TIMELINE.MONTH
              ? <FlatButton onClick={() => downloadScheduleFile('excel')} className='schedule-screen__buttonDownload'>
                  <ArrowEIPIcon className='schedule-screen__buttonArrow' /> <ExcelIcon />
                </FlatButton>
              : null
          }
          {
            !copyTool && permissions.schedule_create_and_edit
              ? <Button onClick={handleCreateNewShift}>
                  {t('Create new shift')}
                </Button>
              : null
          }
        </div>
        <div className="schedule-screen">
          <div style={{display: 'flex', flexDirection: 'row', flex: 1}}>
            <div style={{width: '100%', height: '100%'}}>
              <FullCalendar
                ref={calendarRef}
                initialView={timeline}
                firstDay={1}
                schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
                plugins={[resourceTimelinePlugin, resourceDayGridPlugin, interactionPlugin, momentPlugin]}
                headerToolbar={false}
                aspectRatio={1}
                height="100%"
                eventStartEditable={false}
                eventDurationEditable={timeline === TIMELINE.DAY}
                resourceAreaWidth={timeline === TIMELINE.MONTH ? '20%' : '25%'}
                views={{
                  ...CALENDAR_VIEWS_CONFIG,
                  day: {
                    ...CALENDAR_VIEWS_CONFIG.day,
                    slotMinTime: scheduleSettings.working_at_night ? scheduleSettings.time_view_stats : '00:00:00',
                    slotMaxTime: scheduleSettings.working_at_night ? `${+scheduleSettings.time_view_stats.split(':')[0] + 24}:00:00` : '24:00:00', 
                  },
                  week: {
                    ...CALENDAR_VIEWS_CONFIG.week,
                    slotLabelFormat: renderWeekHeader,
                  },
                  month: {
                    ...CALENDAR_VIEWS_CONFIG.month,
                    slotLabelContent: renderMonthHeader,
                    slotLabelClassNames: ({date: monthDate, view}) => {
                      const isNextMonth = moment(monthDate).isAfter(moment(currentStartDate).endOf('month'))
                      const date = moment(monthDate)
                      const holiday = schedule.holidays[date.date()]
                      const isWeekend = date.day() === 6 || date.day() === 0
                      return isNextMonth ? ['statistic-slot'] : holiday ? [isWeekend ? 'header-holiday-slot-weekend' : 'header-holiday-slot'] : []
                    },
                    visibleRange: () => {
                      const visibleRange = {
                        start: moment(currentStartDate).clone().startOf('month').toDate(),
                        end: moment(currentStartDate).clone().endOf('month').add(permissions.cost && permissions.schedule_costs ? 2 : 1, 'days').toDate(),
                      }
                      return visibleRange
                    },
                  },
                }}
                resourceOrder="order"
                resources={resources}
                events={events}
                eventContent={renderEventContent}
                eventClassNames={handleEventClassNames}
                slotLaneClassNames={handeSlotLaneClassNames}
                slotLaneContent={renderSlotLaneContent}
                resourceAreaHeaderClassNames={() => ['resource-area-header']}
                resourceAreaHeaderContent={renderResourceAreaHeaderContent}
                resourceLaneContent={renderResourceLaneContent}
                resourceLabelClassNames={handleResourceLabelClassNames}
                resourceLabelContent={renderResourceLabelContent}
                locale={localStorage.getItem('i18nextLng') || 'en'}
                eventResize={handleEventChange}
                eventAllow={eventListener}
                eventResizeStart={handleEventChangeStart}
                eventResizeStop={handleEventChangeStop}
                viewDidMount={handleViewDidMount}
              />
            </div>
          </div>
          <Footer
            timeline={timeline}
            data={schedule.timesPanel}
            daysOfMonth={daysOfMonth}
            withCost={permissions.cost && permissions.schedule_costs} />
          {
            schedule.loading
              ? <div className='schedule-screen__overlay-loading'>
                  <Progress />
                </div>
              : null
          }
        </div>
      </div>
      <Tooltip
        id='time_active'
        className='schedule-screen__tooltip schedule-screen__tooltip__active'
        effect='solid' />
      <Tooltip
        id='time'
        className='schedule-screen__tooltip'
        effect='solid' />
      <Tooltip
        id='time_past'
        className='schedule-screen__tooltip schedule-screen__tooltip__past'
        effect='solid' />
      <Tooltip
        id='time_empty'
        className='schedule-screen__tooltip schedule-screen__tooltip__empty'
        effect='solid' />
      <Tooltip
        id='demand_hours'
        className='schedule-screen__tooltip schedule-screen__tooltip__demand'
        effect='solid' />
      <Tooltip
        id='holiday'
        className='schedule-screen__tooltip'
        effect='solid'
      />
      <Tooltip
        id='user_marker'
        className='schedule-screen__tooltip schedule-screen__tooltip__marker'
        effect='solid'
      />
      <Tooltip
        id='user_avatar'
        className='schedule-screen__tooltip schedule-screen__tooltip__avatar'
        arrowColor='transparent'
        style={{backgroundColor: 'transparent'}}
        place="right"
        effect='solid'
      />
      <DialogDeleteShift
        open={openDialog}
        handleClose={handleCloseDialog}
        title={t('Delete Shift?')}
        buttonTitle2={t('Cancel')}
        buttonTitle={t('Delete')}
        shiftName={deletedShiftName}
        submitDeleteShift={() => handleDeleteShift(openDialog)}
        cancelDelete={handleCloseDialog} />
      <DialogClearShift
        open={!!clearConfirmation?.shiftId}
        handleClose={() => setClearConfirmation(false)}
        title={t('Clear Work Times?')}
        buttonTitle2={t('Cancel')}
        buttonTitle={t('Clear')}
        info={clearConfirmation}
        submitDeleteShift={() => handleClearTimes(clearConfirmation.shiftId, clearConfirmation.employeeId)}
        cancelDelete={() => setClearConfirmation(false)}
      />
      {
        modalAddTempEmployee
          ? <AddTempEmployee
              setmodalAddTempEmployee={setmodalAddTempEmployee}
              addTempEmployeeDispatch={addTempEmployeeDispatch}
              unavailableEmployees={unavailableEmployees()}
          />
          : null
      }
      {
        copyTool
          ? <CopyTool
              ref={copyToolRef}
              start={copyToolTime.start || null}
              end={copyToolTime.end || null}
              onClose={handleCloseCopyTool}
              onAddTimelines={handleAddTimelinesHistory}
            />
          : null
      }
    </MainLayout>
  )
}

export default ScheduleV2
