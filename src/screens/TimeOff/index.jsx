import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import MainLayout from '../../components/Core/MainLayout'
import AppNavbar from '../../components/Core/AppNavbar'
import MyTimeOff from '../../components/TimeOff/MytimeOffSection'
import Calendar from '../../components/TimeOff/Calendar'
import TimneOffRequests from '../../components/TimeOff/Requests'

import { userSelector } from '../../store/auth/selectors'

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
}]

const TimeOffScreen = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const user = useSelector(userSelector)

  const [activeTab, setActiveTab] = useState('requests')

  const handleSelectTab = key => {
    setActiveTab(key)
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
                  <TimneOffRequests />
                )
              case 'calendar':
                return (
                  <Calendar />
                )
              case 'employees':
                return null
            }
          })(activeTab)
        }
      </div>
    </MainLayout>
  )
}

export default TimeOffScreen
