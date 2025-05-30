import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useSelector } from 'react-redux'


import config from '../../config'
import { TIMELINE } from '../../const'
import { jobTypesSelector } from '../../store/jobTypes/selectors'
import { shiftTypesSelector } from '../../store/shiftsTypes/selector'
import styles from '../Schedule/EventContent/EventContent.module.scss'

import HolidayIcon from '../../components/Core/HolidayIcon/HolidayIcon'
import Progress from '../../components/Core/Progress'
import MainLayout from '../../components/Core/MainLayout'
import CustomSelect from '../../components/Core/Select/Select'

moment.updateLocale('lt', {
  week: {
    dow: 1,
  },
  weekdays: ["Sekmadienis", "Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis"],
  months: [
    "Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"
  ],
  monthsShort: [
    "Sau", "Vas", "Kov", "Bal", "Geg", "Bir", "Lie", "Rugp", "Rugs", "Spa", "Lap", "Gru"
  ],
})

const CALENDAR_VIEWS_CONFIG = {
  day: {
    type: 'resourceTimelineDay',
    title: 'ddd MMM, DD, YYYY',
    slotLabelFormat: 'HH:mm',
    slotDuration: '1:00',
    snapDuration: '00:30',
  },
  week: {
    type: 'resourceTimelineWeek',
    slotDuration: '24:00',
    snapDuration: '6:00',
  },
  month: {
    type: 'resourceTimelineMonth',
    // slotDuration: '24:00',
    snapDuration: '6:00',
  }
}

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
    }
  )
  const data = await res.json()
  return data
}

const handleEventClassNames = (info) => {
  if (info.event.extendedProps.empty_manual) {
    return ['is-empty-manual']
  }
}

const ScheduleV2 = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const jobTypes = useSelector(state => state.jobTypes.jobTypes)
  const shiftsTypes = useSelector(state => state.shiftTypes)

  const [timeline, setTimeline] = useState(TIMELINE.MONTH)
  const [filter, setFilter] = useState({employers: [], place: [], shiftType: []})
  const [currentStartDate, setCurrentStartDate] = useState(moment().startOf(timeline).format('YYYY-MM-DD'))
  const [schedule, setSchedule] = useState({holidays: {}, resources: [], events: [], loading: false})

  console.log(schedule)

  useEffect(() => {
    getSchedule({type: timeline, formDate: currentStartDate})
  }, [companyId, timeline, currentStartDate])

  const getSchedule = async ({type, formDate}) => {
    const params = {
      type: type,
      from_date: formDate,
      shiftTypeArr: filter?.shiftType.map(({id}) => id),
      employeesArr: filter?.employers.map(({id}) => id),
      placesArr: filter?.place.map(({id}) => id),
    }
    setSchedule(prev => ({...prev, loading: true}))
    const res = await request(`${companyId}/shift`, 'GET', params)
    if (res.success) {
      setSchedule({
        accumulatedHours: res.accumulatedHours,
        holidays: res.holidays,
        events: res.events,
        markers: res.markers,
        resources: res.resources,
        timesPanel: res.timesPanel,
        loading: false,
      })
    }
  }

  const onPlaceSelectFilter = () => {

  }

  const renderMonthHeader = useCallback(({date: monthDate}) => {
    const date = moment(monthDate)
    const holiday = schedule.holidays[date.date()]

    return (
      <>
        <span className='schedule-enter-day'>{ t('Enter') }</span>
        { `${date.format('D')}` }
        <HolidayIcon holidays={holiday} month={true} />
      </>
    )
  }, [schedule.holidays])

  const renderWeekHeader = useCallback(({date: weekDate}) => {
    const date = moment(weekDate)
    const holiday = schedule.holidays[date.date()]

    return (
      <>
        <span className='schedule-enter-day'>{ t('Enter') }</span>
        { `${t(date.format('ddd'))}${date.format(', DD')}` }
        <HolidayIcon holidays={holiday} month={true} />
      </>
    )
  }, [schedule.holidays])

  const renderEventContent = ({event, timeText, view}) => {
    const classes = cn(
      styles.eventContent,
      // {
      //   [styles.dayEnd]: isCompleted,
      //   [styles.eventContent__time]: content === 'addWorkingTime',
      //   [styles.activeDrag]: activeDrag,
      //   'activeDrag': activeDrag,
      //   [styles.eventContent__removeTimelines]: removeTimelines,
      // },
    )
    return (
      <div className={classes}>
      </div>
    )
  }

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
            
        </div>
        <div className="schedule-screen">
          <FullCalendar
            firstDay={1}
            schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
            plugins={[resourceTimelinePlugin, interactionPlugin, momentPlugin]}
            initialView={timeline}
            headerToolbar={false}
            aspectRatio={1}
            height="100%"
            eventStartEditable={false}
            eventDurationEditable={timeline === TIMELINE.DAY}
            views={{
              ...CALENDAR_VIEWS_CONFIG,
              week: {
                ...CALENDAR_VIEWS_CONFIG.week,
                slotLabelFormat: renderWeekHeader,
              },
              month: {
                ...CALENDAR_VIEWS_CONFIG.month,
                slotLabelFormat: renderMonthHeader,
              },
            }}
            resources={schedule.resources}
            events={schedule.events}
            eventContent={renderEventContent}
            eventClassNames={handleEventClassNames}
          />
          {
            schedule.loading
              ? <div className='schedule-screen__overlay-loading'>
                  <Progress />
                </div>
              : null
          }
        </div>
      </div>
    </MainLayout>
  )
}

export default ScheduleV2
