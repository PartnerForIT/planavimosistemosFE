import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { useHistory } from 'react-router-dom'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import styles from './styles.module.scss'

import Button from '../../Core/Button/Button'
import EditIconFixedFill from '../../Icons/EditIconFixedFill'
import ArrowRightButton from '../../Icons/ArrowRightButton'
import AlertCircle from '../../Icons/AlertCircle'
import Progress from '../../Core/Progress'
import RequestBehalf from '../../Core/Dialog/RequestBehalf'
import PolicySymbol from '../PolicySymbol'
import DescriptionIcon from '../../Icons/DescriptionIcon';

import { getEmployeePolicies, getTimeOffEmployeeRequests, updateRequest, createRequest, getCompanyWorkTimeSettings, getCompanyTimeOffs } from '../../../api'

const moment = extendMoment(Moment)

const MyTimeOffSection = ({ companyId, employee }) => {
  const { t } = useTranslation()
  const history = useHistory()

  const employeeId = employee.id

  const [expandedPolicyIds, setExpandedPolicyIds] = useState([])

  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const [policies, setPolicies] = useState([])
  const [workTimeSettings, setWorkTimeSettings] = useState({})

  const requestFormRef = useRef(null)

  const holidaysMap = [...(workTimeSettings.work_time?.holidays || []), ...(workTimeSettings.national_holidays || [])].reduce((acc, holiday) => ({
    ...acc,
    [holiday.date]: true,
  }), {})

  const policiesMap = policies.reduce((acc, policy) => ({
    ...acc,
    [policy.id]: policy,
  }), {})

  useEffect(() => {
    if (companyId && employeeId) {
      init(companyId, employeeId)
    }
  }, [employeeId, companyId])

  const init = async (companyId, employeeId) => {
    setLoading(true)
    const [timeOffs, policies, timeOffRequests, workTimeSettings] = await Promise.all([
      getCompanyTimeOffs(companyId),
      getEmployeePolicies(companyId, employeeId),
      getTimeOffEmployeeRequests(companyId, employeeId),
      getCompanyWorkTimeSettings(companyId),
    ])

    const timeOffsMap = timeOffs.reduce((acc, timeOff) => ({
      ...acc,
      [timeOff.id]: timeOff,
    }), {})
    
    setPolicies(policies.map((p => ({...p, time_off: timeOffsMap[p.time_off_id]}))))
    setRequests(timeOffRequests)
    setWorkTimeSettings(workTimeSettings)
    setLoading(false)
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
      init(companyId, employee.id)
    }
  }

const handleRequest = (params) => {
  requestFormRef.current.open(params)
}

  const expandPolicy = (policyId, expand) => {
    setExpandedPolicyIds((prev) =>
      expand
        ? [...prev, policyId]
        : prev.filter((id) => id !== policyId)
    );
  }

  const goEmployeeActivity = (timeOffId, policyId, employeeId) => {
    history.push(`settings/time-off?page=activity&policy=${policyId}&time_off=${timeOffId}&employee=${employeeId}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>{t('Upcoming requests')} <span className={styles.secondary}>{requests.length}</span></div>
          <Button
            className={styles.button}
            size="large"
            primary
            onClick={() => handleRequest()}
          >
            {t('Fill Request')}
          </Button>
        </div>
        <div>
          {
            requests.length > 0 ? (
              <div className={styles.upcomingRequests}>
                <div className={styles.upcomingRequestsHeader}>
                  <div className={styles.upcomingRequestsHeaderCol}>
                    {t('Request type')}
                  </div>
                  <div className={styles.upcomingRequestsHeaderCol}>
                    {t('Days')}
                  </div>
                  <div className={styles.upcomingRequestsHeaderCol}>
                    {t('When')}
                  </div>
                  <div className={styles.upcomingRequestsHeaderCol}>
                    {t('Requested on')}
                  </div>
                  <div className={styles.upcomingRequestsHeaderCol}>
                    {t('Status')}
                  </div>
                  <div className={styles.upcomingRequestsHeaderCol}></div>
                </div>
                {requests.map((request) => {
                  const policy = policiesMap[request.policy_id] || {};
                  const range = Array.from(moment.range(moment(request.from), moment(request.to)).by('days')).map(date => date.format('YYYY-MM-DD'))
                  const totalWorkingDays = range.reduce((acc, date) => {
                    if (holidaysMap[date]) {
                      return acc
                    }
                    const day = moment(date).day()
                    if (policy.time_off.work_days === 'any_day' || (day !== 0 && day !== 6)) {
                      return acc + 1
                    }
                    return acc
                  }, 0)
                  
                  return (
                    <div key={request.id} className={styles.upcomingRequestsRow}>
                      <div className={styles.upcomingRequestsCol}>
                        <div className={styles.tableName}>
                          <PolicySymbol symbol={policy.symbol} color={policy.color} />
                          {policy.name}
                          {
                            request.note
                              ? <div className={styles.note} data-tooltip-html={request.note} data-tooltip-id='note'>
                                  <DescriptionIcon width={12} height={12} className={styles.noteIcon} />
                                </div>
                              : null
                          }
                        </div>
                      </div>
                      <div className={styles.upcomingRequestsCol}>
                        {totalWorkingDays}
                      </div>
                      <div className={styles.upcomingRequestsCol}>
                        {request.from} - {request.to}
                      </div>
                      <div className={styles.upcomingRequestsCol}>
                        {request.created_at}
                      </div>
                      <div className={styles.upcomingRequestsCol}>
                        <div className={cn(styles.upcomingRequestsStatus, {
                          [styles.requestStatusApproved]: request.status === 'approved',
                          [styles.requestStatusPending]: request.status === 'pending',
                          [styles.requestStatusRejected]: request.status === 'rejected',
                          [styles.requestStatusCancelled]: request.status === 'cancelled',
                        })}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </div>
                      <div className={styles.upcomingRequestsCol}>
                        <div className={styles.upcomingRequestsButtons}>
                          <div data-tooltip-html={t("Edit")} data-tooltip-id="tip_request">
                            <Button
                              className={styles.buttonEdit}
                              size="little"
                              onClick={() => {
                                handleRequest(request)
                              }}
                            >
                              <EditIconFixedFill />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null
          }
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('Policies')} <span className={styles.secondary}>{policies.length}</span></div>
        {
          policies.length > 0 ? (
            <div className={styles.policiesTable}>
              <div className={styles.policiesTableHeader}>
                <div className={styles.policiesTableHeaderCol}>
                </div>
                <div className={styles.policiesTableHeaderCol}>
                  {t('Policy')}
                </div>
                <div className={styles.policiesTableHeaderCol}>
                  {!expandedPolicyIds.length && (
                    t('Current cycle')
                  )}
                </div>
                <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                  {!expandedPolicyIds.length && (
                    t('Cycle allowance')
                  )}
                </div>
                <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                  {!expandedPolicyIds.length && (
                    t('Accrued')
                  )}
                </div>
                <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                  {t('Taken')}
                </div>
                <div className={cn(styles.policiesTableHeaderCol, styles.right)}>
                  {t('Balance')}
                </div>
              </div>
              {
                policies.map((policy) => {
                  const policyEmployeeDetails = policy.employees.find((emp) => emp.id === employeeId)
                  const isExpanded = expandedPolicyIds.includes(policy.id)
                  return (
                    <React.Fragment key={policy.id}>
                      <div className={cn(styles.policiesTableRow, styles.pointer)} onClick={() => expandPolicy(policy.id, !isExpanded)}>
                        <div className={cn(styles.policiesTableCol, styles.policiesTableColExpand)}>
                          <div className={cn(styles.policiesTableExpand, { [styles.active]: isExpanded })}>
                            <ArrowRightButton />
                          </div>
                        </div>
                        <div className={styles.policiesTableCol}>
                          <div className={styles.tableName}>
                            <PolicySymbol symbol={policy.symbol} color={policy.color} />
                            {policy.name}
                          </div>
                        </div>
                        <div className={cn(styles.policiesTableCol, styles.policiesTableColGray, styles.nowrap)}>
                          {!expandedPolicyIds.length
                            ? `${policyEmployeeDetails?.current_cycle_start ? policyEmployeeDetails?.current_cycle_start : ''} ${policyEmployeeDetails?.current_cycle_end ? `- ${policyEmployeeDetails?.current_cycle_end}` : ''}`
                            : null
                          }
                        </div>
                        <div className={cn(styles.policiesTableCol, styles.policiesTableColGray, styles.right)}>
                          {!expandedPolicyIds.length && (
                            policyEmployeeDetails?.cycle_allowance
                          )}
                        </div>
                        <div className={cn(styles.policiesTableCol, styles.policiesTableColGray, styles.right)}>
                          {!expandedPolicyIds.length && (
                            policyEmployeeDetails?.accrued_amount_this_cycle
                          )}
                        </div>
                        <div className={cn(styles.policiesTableCol, styles.right)}>
                          {policyEmployeeDetails?.taken_this_cycle}
                        </div>
                        <div className={cn(styles.policiesTableCol, styles.right)}>
                          {policyEmployeeDetails?.balance}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className={styles.expandedRow}>
                          <div className={styles.expandedContent}>
                            <div className={styles.expandedInfo}>
                              <div>
                                <strong>{t('Cycle period')}:</strong>
                                <div>{policyEmployeeDetails?.current_cycle_start} — {policyEmployeeDetails?.current_cycle_end}</div>
                              </div>
                              <div>
                                <strong>{t('Allowance type')}:</strong>
                                <div>{policyEmployeeDetails?.cycle_type_text}</div>
                              </div>
                              <div></div>
                              <div></div>
                            </div>
                            <div className={styles.expandedInfo}>
                              <div>
                                <strong>{t('Cycle allowance')}:</strong>
                                <div>{policyEmployeeDetails?.cycle_allowance}</div>
                              </div>
                              <div>
                                <strong>{t('Accrued')}:</strong>
                                <div>{policyEmployeeDetails?.accrued_amount_this_cycle}</div>
                              </div>
                              <div>
                                <strong>{t('Adjusted by admin')}:</strong>
                                <div>todo</div>
                              </div>
                              <div>
                                <strong>{t('Days booked')}:</strong>
                                <div>{policyEmployeeDetails?.total_booked}</div>
                              </div>
                            </div>
                            <div className={styles.carryoverInfo}>
                              {
                                policyEmployeeDetails?.carryovers && policyEmployeeDetails.carryovers.length > 0 && (
                                  <div className={styles.carryoverList}>
                                    {policyEmployeeDetails.carryovers.map((carryover) => (
                                      <div key={carryover.id} className={styles.carryoverItem}>
                                        <AlertCircle /> {t("{{days}} days carryover on {{when}} have an expiration date of {{expire}}", { days: carryover.amount, when: carryover.carryover_date, expire: carryover.expire_at })}
                                      </div>
                                    ))}
                                  </div>
                                )
                              }
                            </div>
                            <div className={styles.actionsRow}>
                              <div></div>
                              <div className={styles.actionsRowButtons}>
                                <Button
                                  onClick={() => { goEmployeeActivity(policy.time_off_id, policy.id, employeeId); }}
                                  primary
                                >
                                  {t('Activity')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          ) : null
        }
      </div>
      <RequestBehalf
        ref={requestFormRef}
        title={t('Fill Request')}
        onSubmit={handleSubmitRequest}
        handleClose={() => {}}
        buttonTitle={t('Submit')}
        employees={[{id: employee.id}]}
        policies={policies}
        initialValue={{}}
        activeTimeOff={1}
        singleRequest
      />
      <ReactTooltip
        id='note'
        effect='solid'
        className={styles.tooltip}
      />
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
