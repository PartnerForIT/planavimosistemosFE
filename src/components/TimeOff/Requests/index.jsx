import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import RequestBehalf from '../../Core/Dialog/RequestBehalf'

import styles from './styles.module.scss'

import {
  getCompanyTimeOffPolicies,
  getCompanyTimeOffRequests,
  getCompanyEmployeesAll,
  getPlaces,
  getCompanyTimeOffs,
  getCompanyWorkTimeSettings,
  updateRequestStatus,
  getCompanyInfo,
  updateRequestStatusBulk,
  updateRequest,
} from '../../../api'
import { generateResourcesFromEmployees, getEmployeesFromResources, getCheckedEmployeeIds } from '../Calendar/utils'

import CustomSelect from '../../Core/CustomSelect'
import DRP from '../../Core/DRP/DRP'
import SearchIcon from '../../Icons/SearchIcon'
import Input from '../../Core/Input/Input'
import Progress from '../../Core/Progress'
import StyledCheckbox from '../../Core/Checkbox/Checkbox'
import InfoIcon from '../../Icons/InfoIcon'
import CheckboxIcon from '../../Icons/CheckboxIcon'
import TriangleIcon from '../../Icons/TriangleIcon'
import RequestTableRow from '../RequestTableRow'
import PendingIcon from '../../Icons/PendingIcon';
import ApprovedIcon from '../../Icons/ApprovedIcon';
import SuspendedIcon from '../../Icons/SuspendedIcon';

const moment = extendMoment(Moment)

const generateSections = (requests, keyFormat) => {
  const keyMap = {
    'DD': 'DD',
    'MM': 'MMMM',
    'YY': 'YYYY',
  }
  const format = keyFormat.split('.').map(k => keyMap[k] || k).join(' ')
  return requests.reduce((acc, request) => {
    const sectionKey = request.status === 'pending' ? 'Pending' : moment(request.created_at).format(`dddd, ${format}`)
    if (!acc[sectionKey]) {
      acc[sectionKey] = []
    }
    acc[sectionKey].push(request)
    return acc
  }, {})
}

const filterRequests = (request, query) => {
  if (!query) return true
  const q = query.toLowerCase()
  if (request.employee.title.toLowerCase().includes(q)) return true
  if (request.policy.name.toLowerCase().includes(q)) return true
  if (request.employee.groups?.toLowerCase().includes(q)) return true
  if (request.employee.subgroups?.toLowerCase().includes(q)) return true
  if (request.employee.place?.toLowerCase().includes(q)) return true
  if (request.approver_1_name?.toLowerCase().includes(q)) return true
  if (request.approver_2_name?.toLowerCase().includes(q)) return true
  return false
}

const filterStatuses = (request, statuses) => {
  return statuses.includes(request.status)
}

const TimneOffRequests = ({companyId}) => {
  const { t } = useTranslation()

  const requestFormRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [companyData, setCompanyData] = useState({})
  const [expandedSections, setExpandedSections] = useState([])
  const [query, setQuery] = useState('')
  const [{employees, policies, places, statuses, filterDate}, setFilters] = useState({
    filterDate: {
      start: moment().startOf('isoWeek'),
      end: moment().endOf('isoWeek'),
    },
    places: [],
    policies: [],
    employees: [],
    statuses: ['pending', 'approved', 'rejected'],
  })
  const [sections, setSections] = useState({})
  const [workTimeSettings, setWorkTimeSettings] = useState({})

  const holidaysMap = [...(workTimeSettings.work_time?.holidays || []), ...(workTimeSettings.national_holidays || [])].reduce((acc, holiday) => ({
    ...acc,
    [holiday.date]: true,
  }), {})

  const timeOffRequests = Object.values(sections).flat(Infinity)

  const isCheckedAll = timeOffRequests.length > 0 && timeOffRequests.every(r => r.checked)
  const checkedItems = timeOffRequests.filter(r => r.checked)
  
  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (policies.length && employees.length) {
      getTimeOffRequests()
    }
  }, [places, employees, policies, filterDate])

  const init = async () => {
    const [employeesRes, policiesRes, placesRes, timeOffsRes, workTimesRes, companyRes] = await Promise.all([
      getCompanyEmployeesAll(companyId),
      getCompanyTimeOffPolicies(companyId),
      getPlaces(companyId),
      getCompanyTimeOffs(companyId),
      getCompanyWorkTimeSettings(companyId),
      getCompanyInfo(companyId),
    ])
    
    const data = {employees: [], policies: [], places: []}
    if (Array.isArray(employeesRes?.users)) {
      const grouped = generateResourcesFromEmployees(employeesRes?.users)
      data.employees = grouped
    }
    if (Array.isArray(policiesRes?.policies)) {
      const timeOffsMap = timeOffsRes.reduce((acc, timeOff) => ({
        ...acc,
        [timeOff.id]: timeOff,
      }), {})
      data.policies = policiesRes.policies.map(p => ({...p, checked: false, title: p.name, isEmployee: true, time_off: timeOffsMap[p.time_off_id]}))
    }
    if (Array.isArray(placesRes)) {
      data.places = placesRes.map(p => ({...p, checked: false, title: p.name, isEmployee: true}))
    }
    setCompanyData(companyRes)
    setWorkTimeSettings(workTimesRes)
    setFilters(prev => ({...prev, ...data}))
  }

  const getTimeOffRequests = async () => {
    setLoading(true)
    const params = {
      start_date: filterDate.start.format('YYYY-MM-DD'),
      end_date: filterDate.end.format('YYYY-MM-DD'),
      employees: getCheckedEmployeeIds(employees),
      policies: policies.filter(p => p.checked).map(p => p.id),
      places: places.filter(p => p.checked).map(p => p.id),
    }
    const res = await getCompanyTimeOffRequests(companyId, params)
    if (Array.isArray(res?.request_behalf)) {
      const policiesMap = policies.reduce((acc, policy) => ({
        ...acc,
        [policy.id]: policy,
      }), {})
      const emplloyeesList = getEmployeesFromResources(employees)
      const employeesMap = emplloyeesList.reduce((acc, emp) => ({
        ...acc,
        [emp.id]: emp,
      }), {})
      const timeOffReuests = res.request_behalf.map(r => {
        const policy = policiesMap[r.policy_id]
        const range = Array.from(moment.range(moment(r.from), moment(r.to)).by('days')).map(date => date.format('YYYY-MM-DD'))
        const totalRestDays = range.reduce((acc, date) => {
          if (holidaysMap[date]) {
            return acc
          }
          const day = moment(date).day()
          if (policy.time_off.work_days === 'any_day' || (day !== 0 && day !== 6)) {
            return acc + 1
          }
          return acc
        }, 0)
        return {
          ...r,
          policy: policy,
          employee: employeesMap[r.employee_id],
          approver: employeesMap[r.approved_by],
          totalRestDays: totalRestDays,
          checked: false,
        }
      })
      const sections = generateSections(timeOffReuests, companyData.date_format)
      setSections(sections)
    }
    setLoading(false)
  }

  const handleChangeFilter = (key, data) => {
    setFilters(prev => ({
      ...prev,
      [key]: data,
    }))
  }

  const handleChangeDate = (res) => {
    setFilters(prev => ({
      ...prev,
      filterDate: {
        start: moment(res.startDate),
        end: moment(res.endDate),
      },
    }))
  }

  const handleChangeRequestStatus = async (request, status, employeeIds) => {
    const updated = timeOffRequests.map(r => r.id === request.id ? ({...r, status: status, checked: false}) : r)
    setSections(generateSections(updated, companyData.date_format))
    const res = await updateRequestStatus(companyId, request.time_off_id, request.policy_id, request.id, {status: status, employees: employeeIds})
    if (!res) {
      getTimeOffRequests()
    }
  }

  const handleChangeRequestStatusBulk = async (status, checkedRequests) => {
    const updated = timeOffRequests.map(r => checkedRequests.some(cr => cr.id === r.id) ? ({...r, status: status, checked: false}) : r)
    setSections(generateSections(updated, companyData.date_format))
    const request_behalf_ids = checkedRequests.map(r => r.id)
    const res = await updateRequestStatusBulk(companyId, {status: status, request_behalf_ids: request_behalf_ids})
    if (!res) {
      getTimeOffRequests()
    }
  }

  const handleToggleAll = () => {
    if (isCheckedAll) {
      setSections(generateSections(timeOffRequests.map(r => ({...r, checked: false})), companyData.date_format))
      return
    }
    setSections(generateSections(timeOffRequests.map(r => ({...r, checked: true})), companyData.date_format))
  }

  const handleSelect = (request) => () => {
    setSections(generateSections(timeOffRequests.map(r => r.id === request.id ? {...r, checked: !r.checked} : r), companyData.date_format))
  }

  const handleExpand = (section, isExpanded) => {
    if (isExpanded) {
      setExpandedSections(expandedSections.filter(s => s !== section))
      return
    }
    setExpandedSections([...expandedSections, section])
  }

  const handleSubmitRequest = async (data) => {
    const post = {
      ...data,
      employees: [data.employee_id],
    }
    await updateRequest(companyId, data.time_off_id, data.policy_id, data.id, post)
    requestFormRef.current.close()
    getTimeOffRequests()
  }

  const handleEdit = (params) => {
    console.log(params)
    requestFormRef.current.open(params)
  }

  const handleFilterStatus = (status) => () => {
    setFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status) ? prev.statuses.filter(s => s !== status) : [...prev.statuses, status],
    }))
  }

  

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.toolsContainer}>
          <DRP
            initRange={{startDate: filterDate.start.toDate(), endDate: filterDate.end.toDate()}}
            onChange={handleChangeDate} />
          <div style={{flex: 1}}>
            <Input
              icon={<SearchIcon />}
              placeholder={`${t('Search')}...`}
              width="100%"
              height='36px'
              value={query}
              onChange={(e) => setQuery(e.target.value)} />
          </div>
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
          <div className={styles.content}>
            <div className={cn(styles.header, styles.row)}>
              <div className={cn(styles.cell, styles.center)}>
                <StyledCheckbox
                  id='all'
                  checked={isCheckedAll}
                  onChange={handleToggleAll} />
              </div>
              <div className={styles.cell}>{t('Action')}</div>
              <div className={cn(styles.cell, styles.status)}>
                {t('Status')}
                <div className={cn(styles.statusButton, {[styles.active]: statuses.includes('pending')})} onClick={handleFilterStatus('pending')}>
                  <PendingIcon />
                </div>
                <div className={cn(styles.statusButton, {[styles.active]: statuses.includes('approved')})} onClick={handleFilterStatus('approved')}>
                  <ApprovedIcon />
                </div>
                <div className={cn(styles.statusButton, {[styles.active]: statuses.includes('rejected')})} onClick={handleFilterStatus('rejected')}>
                  <SuspendedIcon />
                </div>
              </div>
              <div className={styles.cell}>{t('Employee')}</div>
              <div className={styles.cell}>{t('Request type')}</div>
              <div className={styles.cell}>{t('Days')}</div>
              <div className={styles.cell}>{t('When')}</div>
              <div className={styles.cell}>{t('Requested on')}</div>
              <div className={styles.cell}>{t('Group')}</div>
              <div className={styles.cell}>{t('Sub group')}</div>
              <div className={styles.cell}>{t('Place')}</div>
              <div className={styles.cell}>{t('1st approver')}</div>
              <div className={styles.cell}>{t('2nd approver')}</div>
            </div>
            <div className={styles.body}>
              {
                Object.entries(sections).filter(([_, requests]) => {
                  return requests.some(r => filterRequests(r, query) && filterStatuses(r, statuses))
                }).map(([section, requests]) => {
                  const isExpanded = expandedSections.includes(section)
                  return (
                    <div key={section} className={cn(styles.section, {[styles.active]: isExpanded})}>
                      <div className={styles.sectionHeader} onClick={() => handleExpand(section, isExpanded)}>
                        <TriangleIcon className={cn(styles.icon)} />
                        {section} ({requests.length})
                      </div>
                      {
                        isExpanded && requests.filter(r => filterRequests(r, query) && filterStatuses(r, statuses)).map(request => {
                          return (
                            <RequestTableRow
                              key={request.id}
                              request={request}
                              onSelect={handleSelect}
                              onEdit={handleEdit}
                              onChangeRequestStatus={handleChangeRequestStatus} />
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles.sidebarContainer, {[styles.active]: timeOffRequests.some(r => r.checked)})}>
        <div className={styles.header}>
          <InfoIcon />
          { t('Multiple entries selection') }
        </div>
        <div className={styles.sidebarContent}>
          <CheckboxIcon className={styles.checkboxIcon} />
          <div className={styles.entry}>{ checkedItems.length } {checkedItems.length === 1 ? 'entry' : 'entries'}</div>
          <div className={styles.selected}>{ t('selected') }</div>
        </div>
        <div className={styles.sidebarFooter}>
          <button
            type="button"
            disabled={checkedItems.every(r => r.status === 'approved')}
            className={cn(styles.button, styles.approve)}
            onClick={() => handleChangeRequestStatusBulk('approved', checkedItems)}>
            { t('Approve') }
          </button>
          <button
            type="button"
            disabled={checkedItems.every(r => r.status === 'rejected')}
            className={cn(styles.button, styles.reject)}
            onClick={() => handleChangeRequestStatusBulk('rejected', checkedItems)}>
            { t('Reject') }
          </button>
        </div>
      </div>
      <ReactTooltip
        id='note'
        effect='solid'
        className={styles.tooltip} />
      <RequestBehalf
        ref={requestFormRef}
        title={t('Fill Request')}
        onSubmit={handleSubmitRequest}
        handleClose={() => {}}
        buttonTitle={t('Submit')}
        employees={[]} // {id: employee.id}
        policies={policies}
        initialValue={{}}
        activeTimeOff={1}
        singleRequest />
      {
        loading
          ? <div className={styles.overlayProgress}>
              <Progress />
            </div>
          : null
      }
    </div>
  )
}

export default TimneOffRequests
