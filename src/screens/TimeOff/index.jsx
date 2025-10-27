import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import MainLayout from '../../components/Core/MainLayout'
import AppNavbar from '../../components/Core/AppNavbar'
import MyTimeOff from '../../components/TimeOff/MytimeOffSection'
import Calendar from '../../components/TimeOff/Calendar'
import TimneOffRequests from '../../components/TimeOff/Requests'
import MyEmployeesSection from '../../components/TimeOff/MyEmployeesSection'
import usePermissions from '../../components/Core/usePermissions'

import { userSelector } from '../../store/auth/selectors'
import { useQuery } from '../../hooks/useQuery'

const permissionsConfig = [
  {
    name: 'time_off_see_my_employees',
    module: 'time_off',
    permission: 'time_off_see_my_employees',
  },
]



const TimeOffScreen = () => {
  const { t } = useTranslation()
  const { id: companyId } = useParams()
  const { tab: activeTab } = useQuery(['tab:time_off'])
  const history = useHistory()
  const permissions = usePermissions(permissionsConfig)
  const user = useSelector(userSelector)

  const options = [{
    title: t('My time off'),
    key: 'time_off',
    badge: 0,
  }, {
    title: t('Requests'),
    key: 'requests',
    badge: 0,
  }, {
    title: t('Calendar'),
    key: 'calendar',
    badge: 0,
  },
  {
    title: t('My employees'),
    key: 'employees',
    badge: 0,
  }]

  const handleSelectTab = key => {
    history.push({search: `?tab=${key}`})
  }

  const filteredOptions = options.reduce((acc, o) => {
    if (o.key === 'requests') {
      o.badge = user.timeoff_counter
    }
    return [...acc, ...(o.key !== 'employees' || permissions.time_off_see_my_employees ? [o] : [])]
  }, [])

  return (
    <MainLayout layoutClassName={styles.layout} screenClassName={styles.screen}>
      <div className={styles.navBar}>
        <AppNavbar
          options={filteredOptions}
          selected={activeTab}
          onSelect={handleSelectTab}
          requestsCounter={user.timeoff_counter} />
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
