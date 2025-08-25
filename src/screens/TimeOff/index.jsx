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

const changeRequestStatus = async (companyId, timeOffId, policyId, requestId, data) => {
  const res = await request(`${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/${requestId}/status`, 'POST', data)
  return res
}

const unAsssingPolicy = async (companyId, timeOffId, policyId, data) => {
  const res = await request(`${companyId}/time-off/${timeOffId}/policy/${policyId}/unasign-employees`, 'PATCH', data)
  return res
}

const getTimeOffs = async (companyId) => {
  const res = await request(`${companyId}/time-off`)
  if (res.success && Array.isArray(res.time_offs)) {
    return res.time_offs
  }
  return []
}

const getPolicies = async (companyId, timeOffId) => {
  const res = await request(`${companyId}/time-off/${timeOffId}/policy`)
  if (res.success && Array.isArray(res.policies)) {
    return res.policies
  }
  return []
}

const getTimeOffRequests = async (companyId, timeOffId, policyId) => {
  const res = await request(`${companyId}/time-off/${timeOffId}/policy/${policyId}/request-behalf/employee/925`)
  if (Array.isArray(res.request_behalf)) {
    return res.request_behalf
  }
  return []
}

const TimeOffScreen = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const user = useSelector(userSelector)

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('time_off')
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
    init()
  }, [])

  const init = async () => {
    setLoading(true)
    const timeOffs = await getTimeOffs(companyId)
    const policies = (await Promise.all(timeOffs.map(t => getPolicies(companyId, t.id)))).flat().filter(p => p.employees.find(e => e.employee_id === 925)) // employee.id
    setPolicies(policies)
    const timeOffRequests = (await Promise.all(policies.map(p => getTimeOffRequests(companyId, p.time_off_id, p.id)))).flat()
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
      init()
    }
  }

  const handleChangeRequestStatus = async (request, status) => {
    await changeRequestStatus(companyId, request.time_off_id, request.policy_id, request.id, {status: status, employees: [request.employee_id]})
    init()
  }

  const handleUnAssign = async (policy) => {
    await unAsssingPolicy(companyId, policy.time_off_id, policy.id, {employees: [925]}) // user.employee
    init()
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
                    onRequest={handleRequest}
                    onChangeRequestStatus={handleChangeRequestStatus}
                    onUnassign={handleUnAssign} />
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
      <RequestBehalf
        ref={requestFormRef}
        title={t('Request on behalf')}
        onSubmit={handleSubmitRequest}
        handleClose={() => {}}
        buttonTitle={t('Submit')}
        employees={[{id: 925}]} // user.employee
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
