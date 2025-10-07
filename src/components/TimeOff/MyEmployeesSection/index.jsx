import React, { useEffect } from 'react'

import styles from './styles.module.scss'

import { getEmployeePolicies, getTimeOffEmployeeRequests, updateRequest, createRequest, getCompanyWorkTimeSettings, getCompanyTimeOffs } from '../../../api'

const MyEmployeesSection = ({ companyId, employee }) => {
  const employeeId = employee.id

  useEffect(() => {
    getEmployeePolicies(companyId, employeeId).then(res => {
      console.log(res)
    })
  }, [])

  return (
    <div>My Employees Section</div>
  )
}

export default MyEmployeesSection
