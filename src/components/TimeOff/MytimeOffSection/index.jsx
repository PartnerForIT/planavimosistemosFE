import React, { useState, useEffect } from 'react'

import styles from './styles.module.scss'

import Progress from '../../Core/Progress'
import EmployeeView from '../EmployeeView'

import { getCompanyWorkTimeSettings, getCompanyTimeOffs } from '../../../api'
import { useQuery } from '../../../hooks/useQuery'

const MyTimeOffSection = ({ companyId, employee }) => {
  const employeeId = employee.id

  const { tab, timeOffId, policyId, view } = useQuery(['tab', 'timeOffId', 'policyId', 'employeeId', 'view:requests'])

  const [loading, setLoading] = useState(true)
  const [timeOffs, setTimeOffs] = useState([])
  const [workTimeSettings, setWorkTimeSettings] = useState({})

  const holidaysMap = [...(workTimeSettings.work_time?.holidays || []), ...(workTimeSettings.national_holidays || [])].reduce((acc, holiday) => ({
    ...acc,
    [holiday.date]: true,
  }), {})

  const timeOffsMap = timeOffs.reduce((acc, timeOff) => ({
    ...acc,
    [timeOff.id]: timeOff,
  }), {})

  useEffect(() => {
    if (companyId) {
      init(companyId)
    }
  }, [companyId])

  const init = async (companyId) => {
    setLoading(true)
    const [timeOffsRes, workTimeSettings] = await Promise.all([
      getCompanyTimeOffs(companyId),
      getCompanyWorkTimeSettings(companyId),
    ])

    if (Array.isArray(timeOffsRes)) {
      setTimeOffs(timeOffsRes)
    }
    setWorkTimeSettings(workTimeSettings)
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <EmployeeView
        isMe={true}
        tab={tab}
        companyId={companyId}
        timeOffId={timeOffId}
        policyId={policyId}
        employeeId={employeeId}
        view={view}
        employee={employee}
        timeOffs={timeOffsMap}
        holidays={holidaysMap} />
      {
        loading
          ? <div className={styles.loader}>
              <Progress />
            </div>
          : null
      }
    </div>
  )
}

export default MyTimeOffSection
