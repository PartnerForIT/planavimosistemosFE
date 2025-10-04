import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import cn from 'classnames'

import styles from './styles.module.scss'

import { getCompanyTimeOffPolicies, getCompanyTimeOffRequests, getCompanyEmployeesAll, getPlaces } from '../../../api'

import CustomSelect from '../../Core/CustomSelect'
import DRP from '../../Core/DRP/DRP'

const TimneOffRequests = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [{employees, policies, places, filterDate}, setFilters] = useState({
    filterDate: {
      start: moment(),
      end: moment().endOf('week'),
    },
    places: [],
    policies: [],
    employees: [],
  })
  const [timeOffRequests, setTimeOffRequests] = useState([])
  
  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (policies.length && employees.length) {
      getTimeOffRequests()
    }
  }, [places.length, employees.length, policies.length, filterDate])

  const init = async () => {
    const [employeesRes, policiesRes, placesRes] = await Promise.all([
      getCompanyEmployeesAll(companyId),
      getCompanyTimeOffPolicies(companyId),
      getPlaces(companyId),
    ])
    
    const data = {employees: [], policies: [], places: []}
    if (Array.isArray(employeesRes?.users)) {
      data.employees = employeesRes.users.map(e => ({...e, checked: false, title: `${e.name} ${e.surname}`, isEmployee: true}))
    }
    if (Array.isArray(policiesRes?.policies)) {
      data.policies = policiesRes.policies.map(p => ({...p, checked: false, title: p.name, isEmployee: true}))
    }
    if (Array.isArray(placesRes)) {
      data.places = placesRes.map(p => ({...p, checked: false, title: p.name, isEmployee: true}))
    }
    setFilters(prev => ({...prev, ...data}))
  }

  const getTimeOffRequests = async () => {
    const params = {
      start_date: filterDate.start.format('YYYY-MM-DD'),
      end_date: filterDate.end.format('YYYY-MM-DD'),
    }
    const res = await getCompanyTimeOffRequests(companyId, params)
    if (Array.isArray(res?.request_behalf)) {
      const policiesMap = policies.reduce((acc, policy) => ({
        ...acc,
        [policy.id]: policy,
      }), {})
      setTimeOffRequests(res.request_behalf.map(r => ({...r, policy: policiesMap[r.policy_id]})))
    }
  }

  const handleChangeFilter = (key, data) => {
    setFilters(prev => ({
      ...prev,
      [key]: data,
    }))
  }

  const handleChangeDate = (res) => {
    console.log(res)
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolsContainer}>
        <DRP initRange={{startDate: filterDate.start.toDate(), endDate: filterDate.end.toDate()}} onChange={handleChangeDate} />
        <CustomSelect
          placeholder={t('All places')}
          items={places}
          onChange={data => handleChangeFilter('places', data)}
          width='auto' />
        <CustomSelect
          placeholder={t('All Policies')}
          items={policies}
          onChange={data => handleChangeFilter('policies', data)}
          width='auto' />
        <CustomSelect
          placeholder={t('All employees')}
          buttonLabel={t('Filter')}
          items={employees}
          onChange={data => handleChangeFilter('employees', data)}
          width='auto' />
      </div>
      <div className={styles.table}>
        <div className={cn(styles.header, styles.row)}>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
          <div className={styles.cell}></div>
        </div>
        <div className={styles.body}>
          {
            timeOffRequests.map(request => {
              console.log(request)
              return (
                <div key={request.id} className={cn(styles.row)}>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default TimneOffRequests
