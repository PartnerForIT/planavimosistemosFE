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

import { userSelector } from '../../store/auth/selectors'

const useQuery = (param) => {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search).get(param), [search])
}

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
// {
//   title: 'My employees',
//   key: 'employees',
//   badge: 0,
// }
]

const TimeOffScreen = () => {
  const { id: companyId } = useParams()
  const queryTab = useQuery('tab')
  const history = useHistory()

  const user = useSelector(userSelector)

  const activeTab = queryTab || 'time_off'

  const handleSelectTab = key => {
    history.push({search: `?tab=${key}`})
  }

  return (
    <MainLayout layoutClassName={styles.layout} screenClassName={styles.screen}>
      <div className={styles.navBar}>
        <AppNavbar
          options={options}
          selected={activeTab}
          onSelect={handleSelectTab} />
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
                    companyId={companyId}
                    employee={user.employee} />
                )
            }
          })(activeTab)
        }
      </div>
    </MainLayout>
  )
}

export default TimeOffScreen
