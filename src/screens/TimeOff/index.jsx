import React, { useState } from 'react'

import styles from './styles.module.scss'

import MainLayout from '../../components/Core/MainLayout'
import AppNavbar from '../../components/Core/AppNavbar'
import MyTimeOff from '../../components/TimeOff/MytimeOffSection'

const options = [{
  title: 'My time off',
  key: 'time_off',
  badge: 0,
}, {
  title: 'Requests',
  key: 'requests',
  badge: 7,
}, {
  title: 'Calendar',
  key: 'calendar',
  badge: 0,
}, {
  title: 'My employees',
  key: 'employees',
  badge: 0,
}]

const TimeOffScreen = () => {
  const [activeTab, setActiveTab] = useState('time_off')

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
                  <MyTimeOff />
                )
              case 'requests':
                return null
              case 'calendar':
                return null
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
