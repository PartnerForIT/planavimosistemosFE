import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import MainLayout from '../../components/Core/MainLayout'
import AppNavbar from '../../components/Core/AppNavbar'
import MyTimeOff from '../../components/TimeOff/MytimeOffSection'
import RequestBehalf from '../../components/Core/Dialog/RequestBehalf'
import Progress from '../../components/Core/Progress'
import Calendar from '../../components/TimeOff/Calendar'

import config from '../../config'
import { userSelector } from '../../store/auth/selectors'

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
  if (res.headers.get('Content-Type').includes('application/json')) {
    const data = await res.json()
    return data
  }
  
  return null
}

const createRequest = async (companyId, timeOffId, policyId, data) => {
  const res = await request(`${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/store`, 'POST', data)
  return res
}

const updateRequest = async (companyId, timeOffId, policyId, requestId, data) => {
  const res = await request(`${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestId}`, 'POST', data)
  return res
}

const getPolicies = async (companyId, employeeId) => {
  const res = await request(`${companyId}/time-off/all/policy/employee/${employeeId}`)
  if (res.success && Array.isArray(res.policies)) {
    return res.policies
  }
  return []
}

const getTimeOffRequests = async (companyId, employeeId) => {
  const res = await request(`${companyId}/time-off/all/policy/all/request-behalf/employee/${employeeId}`)
  if (Array.isArray(res?.request_behalf)) {
    return res.request_behalf
  }
  return []
}

const TimeOffScreen = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const user = useSelector(userSelector)

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('calendar')
  const [requests, setRequests] = useState([])
  const [policies, setPolicies] = useState([])

  const requestFormRef = useRef(null)

  const options = [{
    title: 'My time off',
    key: 'time_off',
    badge: 0,
  }, {
    title: 'Requests',
    key: 'requests',
    badge: requests.length,
  }, {
    title: 'Calendar',
    key: 'calendar',
    badge: 0,
  }, {
    title: 'My employees',
    key: 'employees',
    badge: 0,
  }]

  useEffect(() => {
    if (companyId && user.employee.id) {
      init(companyId, user.employee.id)
    }
    
  }, [user.employee.id, companyId])

  const init = async (companyId, employeeId) => {
    setLoading(true)
    const policies = await getPolicies(companyId, employeeId)
    setPolicies(policies)
    const timeOffRequests = await getTimeOffRequests(companyId, user.employee.id)
    setRequests(timeOffRequests)
    setLoading(false)
  }

  const handleSelectTab = key => {
    setActiveTab(key)
  }

  const handleRequest = (params) => {
    requestFormRef.current.open(params)
  }

  const handleSubmitRequest = async (data) => {
    const selectedPolicy = policies.find(({id}) => id === data.policy_id)
    if (selectedPolicy) {
      requestFormRef.current.close()
      if (data.id) {
        await updateRequest(companyId, selectedPolicy.time_off_id, data.policy_id, data.id, data)
      } else {
        await createRequest(companyId, selectedPolicy.time_off_id, data.policy_id, data)
      }
      init(companyId, user.employee.id)
    }
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
                    requests={requests}
                    policies={policies}
                    employee={user.employee}
                    onRequest={handleRequest} />
                )
              case 'requests':
                return (
                  null
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
      <RequestBehalf
        ref={requestFormRef}
        title={t('Request on behalf')}
        onSubmit={handleSubmitRequest}
        handleClose={() => {}}
        buttonTitle={t('Submit')}
        employees={[{id: user.employee.id}]}
        policies={policies}
        initialValue={{}}
        activeTimeOff={1}
        singleRequest
      />
      
      {
        loading
          ? <div className={styles.loader}>
              <Progress />
            </div>
          : null
      }
      
    </MainLayout>
  )
}

export default TimeOffScreen
