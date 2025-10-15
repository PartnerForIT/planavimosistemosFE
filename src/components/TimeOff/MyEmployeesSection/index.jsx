import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useHistory } from 'react-router-dom'

import styles from './styles.module.scss'

import { getCompanyTimeOffPolicies, getCompanyTimeOffs, createRequest, createAdjustBalance, createAdjustTimeUsed } from '../../../api'
import useCompanyInfo from '../../../hooks/useCompanyInfo'
import { useQuery } from '../../../hooks/useQuery'

import Select from '../Select'
import PolicySymbol from '../PolicySymbol'
import DescriptionIcon from '../../Icons/DescriptionIcon'
import TableIcon from '../../Icons/TableIcon'
import DataTable from '../../Core/DataTableCustom/OLT'
import Filter from '../../../components/Settings/TimeOff/TimeOffDetails/Filter'
import RequestBehalf from '../../Core/Dialog/RequestBehalf'
import AdjustBalance from '../../Core/Dialog/AdjustBalance'
import AdjustTimeUsed from '../../Core/Dialog/AdjustTimeUsed'
import Progress from '../../Core/Progress'
import EmployeeView from '../EmployeeView'

const NameWithAvatar = (row) => (
  <div className={styles.cellNameWithAvatar}>
    {
      row.photo && (
        <img
          alt=''
          className={styles.cellNameWithAvatar__image}
          src={row.photo}
        />
      )
    }
    {row.name}
  </div>
)

const ApproverWithAvatar1 = (row) => (
  <div className={styles.cellNameWithAvatar}>
    {
      row.approver_1_photo && (
        <img
          alt=''
          className={styles.cellNameWithAvatar__image}
          src={row.approver_1_photo}
        />
      )
    }
    {row.approver_1}
  </div>
)

const ApproverWithAvatar2 = (row) => (
  <div className={styles.cellNameWithAvatar}>
    {
      row.approver_2_photo && (
        <img
          alt=''
          className={styles.cellNameWithAvatar__image}
          src={row.approver_2_photo}
        />
      )
    }
    {row.approver_2}
  </div>
)

const columnsWidthArray = {
  name: 250,
  em_status: 150,
  email: 300,
  role: 150,
  skills: 150,
  groups: 150,
  subgroup: 150,
  balance: 150,
  accrued_amount_this_cycle: 150,
  taken_this_cycle: 150,
  booked_before_cycle: 150,
  cycle_type_text: 150,
  current_cycle_start: 150,
  current_cycle_end: 150,
  annual_allowance_text: 150,
  employment_effective_date_text: 150,
  approver_1: 150,
  approver_2: 150,
}

const columns = [
  { label: 'Employee', field: 'name', checked: true, cellRenderer: NameWithAvatar },
  { label: 'Employment status', field: 'em_status', checked: true },
  { label: 'Email', field: 'email', checked: true },
  { label: 'Role', field: 'role', checked: true },
  { label: 'Skill', field: 'skills', checked: true },
  { label: 'Group', field: 'groups', checked: true },
  { label: 'Sub-Group', field: 'subgroup', checked: true },
  { label: 'Balance', field: 'balance', checked: true },
  { label: 'Amount accrued this cycle', field: 'accrued_amount_this_cycle', checked: true },
  { label: 'Taken this cycle', field: 'taken_this_cycle', checked: true },
  { label: 'Booked before cycle', field: 'booked_before_cycle', checked: true },
  { label: 'Cycle type', field: 'cycle_type_text', checked: true },
  { label: 'Current cycle start', field: 'current_cycle_start', checked: true },
  { label: 'Current cycle end', field: 'current_cycle_end', checked: true },
  { label: 'Annual allowance', field: 'annual_allowance_text', checked: true },
  { label: 'Employment effective date', field: 'employment_effective_date_text', checked: true },
  { label: 'First approver', field: 'approver_1', checked: true, cellRenderer: ApproverWithAvatar1 },
  { label: 'Second approver', field: 'approver_2', checked: true, cellRenderer: ApproverWithAvatar2 },
]

const MyEmployeesSection = ({ companyId }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { tab, policyId: selectedPolicyId, employeeId, view } = useQuery(['tab', 'policyId', 'employeeId', 'view:requests'])

  const { getDateFormat } = useCompanyInfo()
  const dateFormat = getDateFormat({
    'YY.MM.DD': 'YYYY, MMM DD',
    'DD.MM.YY': 'DD MMM, YYYY',
    'MM.DD.YY': 'MMM DD, YYYY',
  })

  const [policySections, setPolicySections] = useState([])

  const [columnsArray, setColumnsArray] = useState(columns)
  const [employees, setEmployees] = useState([])
  const [timeOffs, setTimeOffs] = useState([])
  const [workTimeSettings, setWorkTimeSettings] = useState({})
  const [all, setAll] = useState(false)
  const [colSearch, setColSearch] = useState({})
  const [adjustBalanceOpen, setAdjustBalanceOpen] = useState(false)
  const [adjustTimeUsedOpen, setAdjustTimeUsedOpen] = useState(false)
  const [requestBehalfOpen, setRequestBehalfOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const policies = policySections.flatMap(s => s.data)
  const selectedPolicy = policies.find(section => section.id === selectedPolicyId)

  const employeesFiltered = useMemo(() => {
    return employees
      .filter(empl => {
        // Filter out any employees that don't match the search criteria
        let searchValue = search.toLowerCase();
        let globalSearch = true;
        if (searchValue) {
          globalSearch = false;
          for (let key in empl) {
            let emplValue = empl[key];
            if (emplValue !== undefined && emplValue !== null) {
              if (key === 'created_at' || key === 'updated_at') {
                // Special handling for date fields
                emplValue = moment(emplValue).format(`${dateFormat} HH:mm`).toLowerCase();
              } else if (key === 'active_timer') {
                emplValue = (emplValue?.id ? t('Yes') : t('No')).toString().toLowerCase();
              } else {
                // Convert emplValue to string for other fields
                emplValue = emplValue.toString().toLowerCase();
              }

              if (emplValue.indexOf(searchValue) !== -1) {
                globalSearch = true;
                break;
              }
            }
          }
        }

        if (globalSearch) {
          for (let key in colSearch) {
            if (colSearch[key]) { // Check if there's a search term for this key
              let emplValue = empl[key];
              let searchValue = colSearch[key].toLowerCase();

              if (emplValue !== undefined && emplValue !== null) { // Check if the employee has a value for this key
                if (key === 'created_at' || key === 'updated_at') {
                  // Special handling for date fields
                  emplValue = moment(emplValue).format(`${dateFormat} HH:mm`).toLowerCase();
                } else if (key === 'active_timer') {
                  emplValue = (emplValue?.id ? t('Yes') : t('No')).toString().toLowerCase();
                } else {
                  // Convert emplValue to string for other fields
                  emplValue = emplValue.toString().toLowerCase();
                }

                if (emplValue.indexOf(searchValue) === -1) {
                  return false; // This employee does not match the search term
                }
              } else {
                return false; // Missing value for a key that has a search term
              }
            }
          }
        }
        return globalSearch; // Include this employee
      })

  }, [employees, colSearch, dateFormat, search])

  const holidaysMap = [...(workTimeSettings.work_time?.holidays || []), ...(workTimeSettings.national_holidays || [])].reduce((acc, holiday) => ({
    ...acc,
    [holiday.date]: true,
  }), {})

  const timeOffsMap = timeOffs.reduce((acc, timeOff) => ({
    ...acc,
    [timeOff.id]: timeOff,
  }), {})

  const selectedEmployee = employees.find(emp => emp.id === Number(employeeId))

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    if (selectedPolicyId) {
      setLoading(true)
    }
    const [timeOffsRes, policiesRes] = await Promise.all([
      getCompanyTimeOffs(companyId),
      getCompanyTimeOffPolicies(companyId)
    ])

    if (Array.isArray(timeOffsRes) && Array.isArray(policiesRes?.policies)) {
      setTimeOffs(timeOffsRes)
      const timeOffsMap = timeOffsRes.reduce((acc, timeOff) => {
        return { ...acc, [timeOff.id]: timeOff }
      }, {})
      const policiesMap = policiesRes.policies.reduce((acc, policy) => {
        const formattedPolicy = {
          ...policy,
          id: policy.id,
          name: policy.name,
          description: policy.description,
          employees: policy.employees,
          symbol: policy.symbol,
          color: policy.color,
          timeOff: timeOffsMap[policy.time_off_id],
        }
        return {
          ...acc,
          [policy.time_off_id]: acc[policy.time_off_id] ? [...acc[policy.time_off_id], formattedPolicy] : [formattedPolicy]
        }
      })

      const timeOffs = timeOffsRes.map((timeOff) => ({
        id: timeOff.id,
        name: timeOff.name,
        description: timeOff.description,
        data: policiesMap[timeOff.id] || [],
      }), {})
      setPolicySections(timeOffs)
      if (selectedPolicyId) {
        const selected = policiesRes.policies.find(p => p.id === selectedPolicyId)
        if (selected) {
          setEmployees(selected.employees.map(emp => ({ ...emp, name: `${emp.name} ${emp.surname}` })))
        }
      }
      setLoading(false)
    }
  }

  const onColumnSearch = (column, value) => {
    setColSearch({ ...colSearch, [column]: value });
  }

  const sorting = useCallback((employees, { field, asc }) => {
    const sortNumFunction = (a, b) => (asc ? (a[field] - b[field]) : (b[field] - a[field]));
    const sortFunction = (a, b) => {
      if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        return sortNumFunction(a, b);
      }
      if (typeof a[field] === 'object' || typeof b[field] === 'object') {
        return sortNumFunction(a, b);
      }
      if (asc) {
        return a[field].toString()
          .localeCompare(b[field]);
      }
      return b[field].toString()
        .localeCompare(a[field]);
    };
    return employees.sort(sortFunction);
  }, [])

  const handleSelectPolicy = (policy) => {
    history.push({search: `?tab=employees&policyId=${policy.id}`})
    setEmployees(policy.employees.map(emp => ({ ...emp, name: `${emp.name} ${emp.surname}` })))
  }

  const selectAllHandler = (data = []) => {
    const value = data.length
    setEmployees(prev => prev.map((emp) => ({ ...emp, checked: !!value })))
  }

  const selectionHandler = (itemId, value) => {
    const updated = employees.map(emp => emp.id === itemId ? { ...emp, checked: value } : emp)
    setEmployees(updated)
    setAll(updated.every(emp => emp.checked))
  }

  const handleOpenEmployee = (employeeId) => {
    history.push({search: `?tab=employees&policyId=${selectedPolicyId}&employeeId=${employeeId}`})
  }

  const onRequestBehalf = async (data) => {
    await createRequest(companyId, selectedPolicy.timeOff.id, selectedPolicy.id, data)
  }

  const onAdjustBalance = async (data) => {
    await createAdjustBalance(companyId, selectedPolicy.timeOff.id, selectedPolicy.id, data)
    init()
  }

  const onAdjustTimeUsed = async (data) => {
    await createAdjustTimeUsed(companyId, selectedPolicy.timeOff.id, selectedPolicy.id, data)
    init()
  }

  const renderPolicyOption = (policy, isSelected) => {
    return (
      <div className={styles.policyOption}>
        <PolicySymbol symbol={policy?.symbol} color={policy?.color} />
        {policy?.name}
        {
          policy?.description && !isSelected
            ? <div className={styles.description} data-tooltip-html={policy.description} data-tooltip-id="description">
              <DescriptionIcon width={12} height={12} className={styles.noteIcon} />
            </div>
            : null
        }
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <div className={styles.selectContainer}>
        <Select
          placeholder={t('Select a policy')}
          options={policySections}
          value={selectedPolicyId}
          renderSelected={props => renderPolicyOption(props, true)}
          renderOption={renderPolicyOption}
          injectedElements={() => (
            <ReactTooltip
              id="description"
              effect="solid"
              className={styles.tooltip} />
          )}
          onSelect={handleSelectPolicy} />
      </div>
      <div className={styles.content}>
        {
          selectedPolicy
            ? employeeId
              ? <EmployeeView
                  tab={tab}
                  companyId={companyId}
                  timeOffId={selectedPolicy?.time_off_id}
                  policyId={selectedPolicyId}
                  employeeId={employeeId}
                  view={view}
                  employee={selectedEmployee}
                  policy={selectedPolicy}
                  timeOffs={timeOffsMap}
                  holidays={holidaysMap} />
              :  <>
                  <div style={{ width: '100%' }}>
                    <Filter
                      changeUserStatus={() => ({})}
                      checkedItems={employees.filter(emp => emp.checked)}
                      handleRequestBehalf={() => setRequestBehalfOpen(true)}
                      handleAdjustBalance={() => setAdjustBalanceOpen(true)}
                      handleAdjustTimeUsed={() => setAdjustTimeUsedOpen(true)}
                      selectedItem={{}}
                      info={{
                        [t('users assigned')]: employees.length,
                      }}
                      setSearch={setSearch}
                      search={search} />
                  </div>
                  <DataTable
                    data={employeesFiltered}
                    columns={columnsArray}
                    columnsWidth={columnsWidthArray}
                    onColumnsChange={setColumnsArray}
                    selectable
                    sortable
                    loading={false}
                    onSelect={selectionHandler}
                    hoverActions
                    hoverable
                    onSort={(field, asc) => sorting(employeesFiltered, { field, asc })}
                    selectedItem={{}}
                    verticalOffset='296px'
                    selectAllItems={selectAllHandler}
                    all={all}
                    setAll={setAll}
                    accountList
                    colSearch={colSearch}
                    onSearch={onColumnSearch}
                    openButton={handleOpenEmployee} />
                </>
            : <div className={styles.empty}>
              <TableIcon />
              {t('Select any entry to get a detailed editable info')}
            </div>
        }
      </div>
      {
        selectedPolicyId
          ? <RequestBehalf
              open={requestBehalfOpen}
              handleClose={() => setRequestBehalfOpen(false)}
              title={t('Request on behalf')}
              onSubmit={(data) => {
                setRequestBehalfOpen(false)
                onRequestBehalf(data)
              }}
              buttonTitle={t('Submit')}
              employees={employees.filter(emp => emp.checked)}
              policies={policies}
              initialValue={{ policy_id: selectedPolicyId }}
              activeTimeOff={selectedPolicy?.timeOff || {}}
            />
          : null
      }
      {
        selectedPolicyId
          ? <AdjustBalance
              open={adjustBalanceOpen}
              handleClose={() => setAdjustBalanceOpen(false)}
              title={t('Adjust balance')}
              onSubmit={(data) => {
                setAdjustBalanceOpen(false)
                onAdjustBalance(data)
              }}
              buttonTitle={t('Submit')}
              employees={employees.filter(emp => emp.checked)}
              policies={policies}
              initialValue={{ policy_id: selectedPolicyId }}
            />
          : null
      }
      {
        selectedPolicyId
          ? <AdjustTimeUsed
              open={adjustTimeUsedOpen}
              handleClose={() => setAdjustTimeUsedOpen(false)}
              title={t('Adjust time used')}
              onSubmit={(data) => {
                setAdjustTimeUsedOpen(false)
                onAdjustTimeUsed(data)
              }}
              buttonTitle={t('Submit')}
              employees={employees.filter(emp => emp.checked)}
              policies={policies}
              initialValue={{ policy_id: selectedPolicyId }}
            />
          : null
      }
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

export default MyEmployeesSection
