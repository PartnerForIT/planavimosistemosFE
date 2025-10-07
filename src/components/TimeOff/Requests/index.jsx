import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import cn from 'classnames'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import styles from './styles.module.scss'

import { getCompanyTimeOffPolicies, getCompanyTimeOffRequests, getCompanyEmployeesAll, getPlaces, getCompanyTimeOffs, getCompanyWorkTimeSettings, updateRequestStatus, getCompanyInfo } from '../../../api'
import { generateResourcesFromEmployees, getEmployeesFromResources, getCheckedEmployeeIds } from '../Calendar/utils'

import CustomSelect from '../../Core/CustomSelect'
import DRP from '../../Core/DRP/DRP'
import PolicySymbol from '../PolicySymbol'
import DescriptionIcon from '../../Icons/DescriptionIcon'
import EditIconFixedFill from '../../Icons/EditIconFixedFill'
import CheckIcon from '../../Icons/CheckIcon'
import RejectIcon from '../../Icons/RejectIcon'
import SearchIcon from '../../Icons/SearchIcon'
import Input from '../../Core/Input/Input'
import Progress from '../../Core/Progress'
import StyledCheckbox from '../../Core/Checkbox/Checkbox'
import InfoIcon from '../../Icons/InfoIcon'
import CheckboxIcon from '../../Icons/CheckboxIcon'
import TriangleIcon from '../../Icons/TriangleIcon'

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

const TimneOffRequests = () => {
  const { id: companyId } = useParams()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [companyData, setCompanyData] = useState({})
  const [expandedSections, setExpandedSections] = useState([])
  const [query, setQuery] = useState('')
  const [{employees, policies, places, filterDate}, setFilters] = useState({
    filterDate: {
      start: moment().startOf('isoWeek'),
      end: moment().endOf('isoWeek'),
    },
    places: [],
    policies: [],
    employees: [],
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
    const res = await updateRequestStatus(companyId, request.time_off_id, request.policy_id, request.id, {status: status, employees: employeeIds})
    getTimeOffRequests()
  }

  const handleChangeRequestStatusBulk = async (status, employeeIds) => {

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

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.toolsContainer}>
          <DRP initRange={{startDate: filterDate.start.toDate(), endDate: filterDate.end.toDate()}} onChange={handleChangeDate} />
          <Input
            icon={<SearchIcon />}
            placeholder={`${t('Search')}...`}
            width='400px'
            height='36px'
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
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
              <div className={styles.cell}>{t('Status')}</div>
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
                Object.entries(sections).filter(([s, requests]) => {
                  return requests.some(r => filterRequests(r, query))
                }).map(([section, requests]) => {
                  const isExpanded = expandedSections.includes(section)
                  return (
                    <div key={section} className={cn(styles.section, {[styles.active]: isExpanded})}>
                      <div className={styles.sectionHeader} onClick={() => handleExpand(section, isExpanded)}>
                        <TriangleIcon className={cn(styles.icon)} />
                        {section} ({requests.length})
                      </div>
                      {
                        isExpanded && requests.filter(r => filterRequests(r, query)).map(request => {
                          return (
                            <div key={request.id} className={cn(styles.row)}>
                              <div className={cn(styles.cell, styles.center)}>
                                <StyledCheckbox
                                  id={request.id}
                                  checked={request.checked}
                                  onChange={handleSelect(request)} />
                              </div>
                              <div className={cn(styles.cell, styles.actions)}>
                                <div data-tooltip-html={t("Edit")} data-tooltip-id="note" className={styles.icon}>
                                  <EditIconFixedFill />
                                </div>
                                { request.status !== 'approved' && (
                                  <div data-tooltip-html={t("Approve")} data-tooltip-id="note" className={cn(styles.icon, styles.approve)} onClick={() => handleChangeRequestStatus(request, 'approved', [request.employee_id])}>
                                    <CheckIcon />
                                  </div>
                                )}
                                { request.status !== 'rejected' && (
                                  <div data-tooltip-html={t("Reject")} data-tooltip-id="note" className={cn(styles.icon, styles.reject)} onClick={() => handleChangeRequestStatus(request, 'rejected', [request.employee_id])}>
                                    <RejectIcon />
                                  </div>
                                )}
                              </div>
                              <div className={styles.cell}>
                                <div className={cn(styles.status, styles[request.status])}>
                                  { request.status.charAt(0).toUpperCase() + request.status.slice(1) }
                                </div>
                              </div>
                              <div className={styles.cell}>
                                { request.employee.title }
                              </div>
                              <div className={cn(styles.cell, styles.policy)}>
                                <PolicySymbol symbol={request.policy.symbol} color={request.policy.color} />
                                {request.policy.name}
                                {
                                  request.note
                                    ? <div className={styles.note} data-tooltip-html={request.note} data-tooltip-id='note'>
                                        <DescriptionIcon width={12} height={12} className={styles.noteIcon} />
                                      </div>
                                    : null
                                }
                              </div>
                              <div className={styles.cell}>
                                { request.totalRestDays }
                              </div>
                              <div className={styles.cell}>
                                { request.from } - { request.to }
                              </div>
                              <div className={styles.cell}>
                                { request.created_at }
                              </div>
                              <div className={styles.cell}>
                                { request.employee.groups }
                              </div>
                              <div className={styles.cell}>
                                { request.employee.subgroups }
                              </div>
                              <div className={styles.cell}>
                                { request.employee.place }
                              </div>
                              <div className={styles.cell}>
                                { request.approver_1_name }
                              </div>
                              <div className={styles.cell}>
                                { request.approver_2_name }
                              </div>
                            </div>
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
            onClick={() => handleChangeRequestStatusBulk('approved', checkedItems.map(i => i.employee_id))}>
            { t('Approve') }
          </button>
          <button
            type="button"
            disabled={checkedItems.every(r => r.status === 'rejected')}
            className={cn(styles.button, styles.reject)}
            onClick={() => handleChangeRequestStatusBulk('rejected', checkedItems.map(i => i.employee_id))}>
            { t('Reject') }
          </button>
        </div>
      </div>
      <ReactTooltip
        id='note'
        effect='solid'
        className={styles.tooltip} />
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
