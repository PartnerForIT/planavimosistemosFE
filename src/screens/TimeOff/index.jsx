import React, { useMemo } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import styles from './styles.module.scss'

import MainLayout from '../../components/Core/MainLayout'
import AppNavbar from '../../components/Core/AppNavbar'
import MyTimeOff from '../../components/TimeOff/MytimeOffSection'
import Calendar from '../../components/TimeOff/Calendar'
import TimneOffRequests from '../../components/TimeOff/Requests'
import MyEmployeesSection from '../../components/TimeOff/MyEmployeesSection'
import usePermissions from '../../components/Core/usePermissions'
import { timeoffCounterSelector } from '../../store/auth/selectors';

import { userSelector } from '../../store/auth/selectors'
import { useQuery } from '../../hooks/useQuery'

const permissionsConfig = [
  {
    name: 'time_off_see_my_employees',
    module: 'time_off',
    permission: 'time_off_see_my_employees',
  },
]

const options = [{
  title: 'My time off',
  key: 'time_off',
  badge: 0,
}, {
  title: 'Requests',
  key: 'requests',
  badge: 0,
}, {
  title: 'Calendar',
  key: 'calendar',
  badge: 0,
},
{
  title: 'My employees',
  key: 'employees',
  badge: 0,
}
]

const TimeOffScreen = () => {
  const { id: companyId } = useParams()
  const { tab: activeTab } = useQuery(['tab:employees'])
  const history = useHistory()
  const permissions = usePermissions(permissionsConfig)
  const timeOffCounter = useSelector(timeoffCounterSelector)
  const user = useSelector(userSelector)

  const handleSelectTab = key => {
    history.push({search: `?tab=${key}`})
  }

  const filteredOptions = options.filter(option => {
    if (option.key === 'employees') {
      return permissions.time_off_see_my_employees
    }
    return true
  }).map(option => {
    if (option.key === 'requests') {
      return {
        ...option,
        badge: timeOffCounter,
      }
    }
    return option
  })

  return (
    <MainLayout layoutClassName={styles.layout} screenClassName={styles.screen}>
      <div className={styles.navBar}>
        <AppNavbar
          options={filteredOptions}
          selected={activeTab}
          onSelect={handleSelectTab}
          requestsCounter={timeOffCounter} />
      </div>
      <div className={styles.content}>
        {
          (tab => {
            switch (tab) {
              case 'time_off':
                return (
                  <MyTimeOff
                    companyId={companyId}
                    employee={user.employee} />
                )
              case 'requests':
                return (
                  <TimneOffRequests
                    companyId={companyId} />
                )
              case 'calendar':
                return (
                  <Calendar
                    companyId={companyId} />
                )
              case 'employees':
                return (
                  <MyEmployeesSection
                    companyId={companyId} />
                )
            }
          })(activeTab)
        }
      </div>
    </MainLayout>
  )
}

export default TimeOffScreen
